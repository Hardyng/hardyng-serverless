import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
AWS.config.update({region: 'us-east-1'});
async function createSubscription ({Topic, User, Subscription, event, ...props}) {
  const {topic} = JSON.parse(event.body)
  // const {user} = JSON.parse(event.body);
  const {cognitoIdentityId} = event.requestContext.identity;

  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  // cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx:CognitoSignIn:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const parts = authProvider.split(':');
  const userPoolUserId = parts[parts.length - 1];

  const updatedUser = await User.findOne({cognitoId: userPoolUserId}).exec()
  if (!updatedUser) {
    throw new Error('There is no such user registered in database')
  }
  const updatedTopic = await Topic.findById(topic);
  if (!updatedTopic) {
    throw new Error('There is no such topic in database')
  }
  // const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()
  if (updatedTopic.subscriptions.length >= 2) {
    throw new Error('Limit of subscribers per topic is 2.')
  }

  var params = {
    Protocol: 'SMS',
    TopicArn: updatedTopic.arn,
    Endpoint: updatedUser.phoneNumber
  };

  var subscribeSms = await new AWS.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();
  const newSubscription = new Subscription({
    topic,
    user: updatedUser,
    arn: subscribeSms.SubscriptionArn,
  })
  await updatedTopic.update(
    {
      $push: {
        subscriptions: newSubscription,
      }
    });
  await updatedUser.update({
    $push: {
      subscriptions: newSubscription,
    }
  })
  return await newSubscription.save()
}

export const handler = provideDb(createSubscription)
