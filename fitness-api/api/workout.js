const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.get = (event, context, callback) => {
  var params = {
    TableName: process.env.PRE_DEFINED_WORKOUT_TABLE,

    ProjectionExpression:
      'Id, workoutName, workoutTime, workoutDetails, category',
  };

  console.log('Scanning Open Workout table.');

  const onScan = (err, data) => {
    if (err) {
      console.log(
        'Scan failed to load data. Error JSON:',
        JSON.stringify(err, null, 2)
      );

      callback(err);
    } else {
      console.log('Scan succeeded.');

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          workout: data.Items,
        }),
      });
    }
  };

  dynamoDb.scan(params, onScan);
};
