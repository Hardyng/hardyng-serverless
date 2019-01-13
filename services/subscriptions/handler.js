const uuid = require('uuid');
const dynamoDbLib = require('../../lib/dynamodb-lib');
const { success, failure } = require('../../lib/response-lib');

export const main = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: "dev-mono-notes",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      name: data.name,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
};
