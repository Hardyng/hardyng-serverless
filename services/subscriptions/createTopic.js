import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
import { UserAccountType } from './lib/UserAccountType'
AWS.config.update({region: 'us-east-1'})
async function createTopic ({Topic, User, event, ...props}) {
  const {name, description} = JSON.parse(event.body);
  // const {user} = JSON.parse(event.body);
  // const owner = await User.findOne({cognitoId: user});
  console.log(event)
  console.log(event.requestContext.identity)

  // TODO : Provide userId through decorator
  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  // cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx:CognitoSignIn:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const parts = authProvider.split(':');
  const userPoolIdParts = parts[parts.length - 3].split('/');
  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  const owner = await User.findOne({cognitoId: userPoolUserId});
  if(!owner || !owner.accountType || owner.accountType.toLowerCase() !== UserAccountType.ADMIN.toLowerCase()) {
    throw new Error('Permission denied.')
  }
  const awsTopic = await new AWS.SNS({apiVersion: '2010-03-31'}).createTopic({Name: name}).promise();
  const newTopic = new Topic({
    name,
    description,
    owner,
    arn: awsTopic.TopicArn
  })
  await owner.update({
    $push: {
      topics: newTopic
    }
  }).exec()

  return await newTopic.save()
}
export const handler = provideDb(createTopic)
