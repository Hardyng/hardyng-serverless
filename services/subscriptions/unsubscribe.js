import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
AWS.config.update({region: 'us-east-1'});

async function unsubscribe ({User, Subscription, event, ...props}) {
  const {topic} = JSON.parse(event.body)
  const {user} = JSON.parse(event.body)
  // const {cognitoIdentityId} = event.requestContext.identity;
  const updatedUser = await User.findOne({cognitoId: user}).exec()
  // const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()
  const deletedSubscription = await Subscription.findOne({
    topic: topic,
    user: updatedUser,
  })
  await new AWS.SNS({apiVersion: '2010-03-31'}).unsubscribe({SubscriptionArn: deletedSubscription.arn}).promise();
  return await deletedSubscription.delete().exec()
}

export const handler = provideDb(unsubscribe)
