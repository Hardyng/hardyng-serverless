const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

function getSubscriptionList(evt, ctx, cb) {
  dynamo.scan({
    TableName: tableName
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const subscriptions = data.Items;
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(subscriptions)
      })
    }
  })
}

module.exports = {
  handler: getSubscriptionList
};
