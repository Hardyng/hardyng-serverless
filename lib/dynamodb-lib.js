const AWS = require('aws-sdk');

module.exports.call = function(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}
