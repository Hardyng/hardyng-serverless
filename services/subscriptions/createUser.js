// TODO : Implement when serverless add working cognito hooks
const AWS = require('aws-sdk')
const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
import fp from 'lodash/fp';
import { curryDb } from '../../lib/connect'
import { attachModels } from './lib/attachModels'
async function createUser ({User, event, context, callback}) {
  // const user = await cognito.adminGetUser({
  //   UserPoolId: event.userPoolId,
  //   Username: event.userName,
  // }).promise()
  const newUser = await new User({
    cognitoId: event.userName,
    username: event.userName,
  }).save();
  console.log(newUser)
  console.log('User confirmed: User-Pool', event.userPoolId + ", UserId: " + event.userName);
  callback(null, event);
  // return event;
}
export const provideDb = fp.compose(curryDb, attachModels);

export const handler = provideDb(createUser)
