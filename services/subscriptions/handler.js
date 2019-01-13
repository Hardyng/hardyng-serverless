const uuid = require('uuid');
const dynamoDbLib = require('../../libs/dynamodb-lib');
const { success, failure } = require('../../libs/response-lib');

module.exports.main = async (event, context, callback) => {
  // const data = JSON.parse({
  //   name: '123',
  // });
  const params = {
    TableName: "dev-mono-notes",
    Item: {
      // userId: event.requestContext.identity.cognitoIdentityId,
      userId: '999',
      noteId: uuid.v1(),
      name: '123',
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
  // const response = {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Go Serverless v1.0! Your function executed successfully!',
  //     input: event,
  //   }),
  // };
  //
  // callback(null, response);
};

// import uuid from "uuid";
// import * as dynamoDbLib from "../../libs/dynamodb-lib";
// import { success, failure } from "../../libs/response-lib";
//
// export async function main(event, context) {
//   // const data = JSON.parse(event.body);
//   console.log('test');
//   const params = {
//     TableName: "notes",
//     Item: {
//       userId: event.requestContext.identity.cognitoIdentityId,
//       noteId: uuid.v1(),
//       title: 'test',
//       createdAt: Date.now()
//     }
//   };
//
//   try {
//     await dynamoDbLib.call("put", params);
//     return success(params.Item);
//   } catch (e) {
//     return failure({ status: false });
//   }
// }
