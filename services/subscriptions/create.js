const uuid = require('uuid');
const dynamoDbLib = require('../../lib/dynamodb-lib');
const { success, failure } = require('../../lib/response-lib');

export const handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);
  } catch(e) {
    return failure({
      status: false,
      body: {
        message: 'Wrong data passed in request.body.',
      },
    })
  }
  const params = {
    TableName: "dev-mono-notes",
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      subscriptionId: uuid.v1(),
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
