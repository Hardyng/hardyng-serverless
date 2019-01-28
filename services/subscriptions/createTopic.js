import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
import { UserAccountType } from './lib/UserAccountType'
AWS.config.update({region: 'us-east-1'})
async function createTopic ({Topic, User, event, ...props}) {
  const {name, description} = JSON.parse(event.body);
  // const {user} = JSON.parse(event.body);
  // const owner = await User.findOne({cognitoId: user});
  // TODO : Provide userId through decorator
  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  // cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx:CognitoSignIn:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  // const parts = authProvider.split(':');
  // const userPoolIdParts = parts[parts.length - 3].split('/');
  // const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  // const userPoolUserId = parts[parts.length - 1];
  //
  // const owner = await User.findOne({cognitoId: userPoolUserId});
  const owner = await User.findOne({cognitoId: 'e5c3fbed-df86-47db-9e9c-6a7a8539877f'});

  if(!owner) {
    throw new Error('Permission denied.')
  }
  if(owner.availableTopicCreations <= 0) {
    throw new Error('User is not able to create any more topics')
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
    },
    $inc: {
      availableTopicCreations: -1
    }
  }).exec()

  return await newTopic.save()
}
export const handler = provideDb(createTopic)
