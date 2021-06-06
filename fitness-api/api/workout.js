const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.get = async (event, context, callback) => {
  const { category } = event.pathParameters;
  let { anyinTable } = event.queryStringParameters;

  let params = {
    TableName: process.env.PRE_DEFINED_WORKOUT_TABLE,
    KeyConditionExpression: 'category = :pk',
    ExpressionAttributeValues: {
      ':pk': category,
    },
    ProjectionExpression:
      'Id, workoutName, workoutTime, workoutDetails, category',
  };

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

  //     if (anyinTable != null) {
  //       console.log('before filter: ' + data.Items[0].workoutDetails);
  //       filterResults = data.Items.filter((item) =>
  //         item.workoutDetails
  //           .toString()
  //           .toLowerCase()
  //           .includes(anyinTable.toString().toLowerCase())
  //       );
  //       // FilterItems(data.Items, anyinTable);
  //       return callback(null, {
  //         statusCode: 200,
  //         body: JSON.stringify({
  //           workout: filterResults,
  //         }),
  //       });
  //     }

  //     return callback(null, {
  //       statusCode: 200,
  //       body: JSON.stringify({
  //         workout: data.Items,
  //       }),
  //     });
  //   }
  // };

  // dynamoDb.query(params, onQuery);
  try {
    const queryResult = await dynamoDb.query(params).promise();
    console.log(queryResult.Items[0]);
    const filterResults = FilterItems(queryResult.Items, anyinTable);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        workout: filterResults,
      }),
    });
  } catch (err) {
    console.log(err);
  }
};

function FilterItems(items, queryString) {
  let filterWorkoutDetails, filterWorkoutTime, filterWorkoutName, filterResults;
  console.log(items[0]);
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
  console.log('filterWorkoutName: ' + typeof filterWorkoutDetails);
  console.log('filterWorkoutTime: ' + typeof filterWorkoutTime);
  console.log('filterWorkoutDetails: ' + typeof filterWorkoutDetails);
  filterResults = filterWorkoutDetails
    .concat(filterWorkoutName)
    .concat(filterWorkoutTime);
  let set = new Set(filterResults);
  filterResults = Array.from(set);
  console.log('before Return' + filterResults[0]);
  return filterResults;
}

function SearchQueryString(item, queryString) {
  return item.toLowerCase().includes(queryString.toLowerCase());
}
