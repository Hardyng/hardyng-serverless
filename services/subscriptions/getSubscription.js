const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

function getSubscription(evt, ctx, cb) {
  const vId = parseInt(evt.pathParameters.id, 10);
  dynamo.get({
    Key: {
      id: vId
    },

    TableName: tableName
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const subscription = data.Item;
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(subscription)
      })
    }
  })
};
module.exports = {
  handler: getSubscription
};
