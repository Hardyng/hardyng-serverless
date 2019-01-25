import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
AWS.config.update({region: 'us-east-1'});
async function createSubscription ({Topic, User, Subscription, event, ...props}) {
  const {topic} = JSON.parse(event.body)
  const {user} = JSON.parse(event.body);
  // const {cognitoIdentityId} = event.requestContext.identity;
  const updatedUser = await User.findOne({cognitoId: user}).exec()
  const updatedTopic = await Topic.findById(topic);
  // const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()


  var params = {
    Protocol: 'SMS', /* required */
    TopicArn: updatedTopic.arn, /* required */
    Endpoint: updatedUser.phoneNumber
  };

// Create promise and SNS service object
  var subscribeSms = await new AWS.SNS({apiVersion: '2010-03-31'}).subscribe(params).promise();
  console.log(subscribeSms);
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
