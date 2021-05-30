'use strict';

const AWS = require('aws-sdk');
AWS.config.region = process.env.region;
// process.env.AWS_REGION;
const s3 = new AWS.S3();

const docClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const ddbTable = process.env.PRE_DEFINED_WORKOUT_TABLE;
// process.env.DDBtable;

// The Lambda handler
exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2));
  console.log('Using DDB table: ', ddbTable);

  await Promise.all(
    event.Records.map(async (record) => {
      try {
        console.log('Incoming record: ', record);

        // Get original text from object in incoming event
        const originalText = await s3
          .getObject({
            Bucket: event.Records[0].s3.bucket.name,
            Key: event.Records[0].s3.object.key,
          })
          .promise();

        // Upload JSON to DynamoDB
        const jsonData = JSON.parse(originalText.Body.toString('utf-8'));
        await ddbLoader(jsonData);
      } catch (err) {
        console.error(err);
      }
    })
  );
};

// Load JSON data to DynamoDB table
const ddbLoader = async (data) => {
  // Separate into batches for upload
  let batches = [];
  const BATCH_SIZE = 25;

  while (data.length > 0) {
    batches.push(data.splice(0, BATCH_SIZE));
  }

  console.log(`Total batches: ${batches.length}`);

  let batchCount = 0;

  // Save each batch
  await Promise.all(
    batches.map(async (item_data) => {
      // Set up the params object for the DDB call
      const params = {
        RequestItems: {},
      };
      params.RequestItems[ddbTable] = [];

      item_data.forEach((item) => {
        for (let key of Object.keys(item)) {
          // An AttributeValue may not contain an empty string
          if (item[key] === '') delete item[key];
        }

        // Build params
        params.RequestItems[ddbTable].push({
          PutRequest: {
            Item: {
              Id: uuidv4(),
              ...item,
            },
          },
        });
      });

      // Push to DynamoDB in batches
      try {
        batchCount++;
        console.log('Trying batch: ', batchCount);
        const result = await docClient.batchWrite(params).promise();
        console.log('Success: ', result);
      } catch (err) {
        console.error('Error: ', err);
      }
    })
  );
};
