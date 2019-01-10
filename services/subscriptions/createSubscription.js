const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

const tableName = process.env.subscriptionTableName;

function createSubscription(evt, ctx, cb) {
  const item = JSON.parse(evt.body);
  dynamo.put({
    Item: item,
    TableName: tableName
  }, (err, resp) => {
    if (err) {
      cb(err)
    } else {
      cb(null, {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(resp)
      })
    }
  })
};
module.exports = {
  handler: createSubscription
};
