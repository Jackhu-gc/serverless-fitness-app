const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.get = async (event, context, callback) => {
  if (!event.pathParameters) {
    if (!event.queryStringParameters) {
      const err = new Error('missing query parameter - equipments');
      console.log(err);

      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: err.message,
        }),
      });
    }
    const { equipment } = event.queryStringParameters;
    const params = {
      TableName: process.env.PRE_DEFINED_WORKOUT_TABLE,
      ProjectionExpression:
        'Id, workoutName, workoutTime, workoutDetails, category, equipment',
      FilterExpression: 'contains(#equips, :equips)',
      ExpressionAttributeNames: {
        '#equips': 'equipment',
      },
      ExpressionAttributeValues: {
        ':equips': equipment,
      },
    };

    try {
      let queryResult = await dynamoDb.scan(params).promise();

      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          workout: queryResult.Items,
        }),
      });
    } catch (err) {
      console.log(err);
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: err.message,
        }),
      });
    }
  }

  console.log('Query Workout table.');

  // const onQuery = (err, data) => {
  //   if (err) {
  //     console.log(
  //       'Query failed to load data. Error JSON:',
  //       JSON.stringify(err, null, 2)
  //     );
  //     callback(err);
  //   } else {
  //     console.log('Query succeeded.');
  //     return callback(null, {
  //       statusCode: 200,
  //       body: JSON.stringify({
  //         workout: data.Items,
  //       }),
  //     });
  //   }
  // };
  // dynamoDb.query(params, onQuery);
  const { category } = event.pathParameters;
  const { anyinTable } = event.queryStringParameters || {};

  const params = {
    TableName: process.env.PRE_DEFINED_WORKOUT_TABLE,
    KeyConditionExpression: 'category = :pk',
    ExpressionAttributeValues: {
      ':pk': category,
    },
    ProjectionExpression:
      'Id, workoutName, workoutTime, workoutDetails, category, equipment',
  };

  try {
    let queryResult = await dynamoDb.query(params).promise();
    let queryResultItems = queryResult.Items;
    if (anyinTable) {
      queryResultItems = FilterItems(queryResultItems, anyinTable);
    }
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        workout: queryResultItems,
      }),
    });
  } catch (err) {
    console.log(err);
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    });
  }
};

function FilterItems(items, queryString) {
  let filterWorkoutDetails, filterWorkoutTime, filterWorkoutName, filterResults;

  filterWorkoutDetails = items.filter((item) => {
    if (item.workoutDetails != undefined) {
      return SearchQueryString(item.workoutDetails, queryString);
    }
  });

  filterWorkoutTime = items.filter((item) => {
    if (item.workoutTime != undefined) {
      return SearchQueryString(item.workoutTime, queryString);
    }
  });

  filterWorkoutName = items.filter((item) => {
    if (item.workoutName != undefined) {
      return SearchQueryString(item.workoutName, queryString);
    }
  });

  filterResults = filterWorkoutDetails
    .concat(filterWorkoutName)
    .concat(filterWorkoutTime);
  let set = new Set(filterResults);
  filterResults = Array.from(set);

  return filterResults;
}

function SearchQueryString(item, queryString) {
  return item.toLowerCase().includes(queryString.toLowerCase());
}
