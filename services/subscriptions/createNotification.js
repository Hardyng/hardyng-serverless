import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
import { UserAccountType } from './lib/UserAccountType'
AWS.config.update({region: 'us-east-1'})

async function createNotification ({Notification, Topic, User, Subscription, event, ...props}) {
  const {topic, message} = JSON.parse(event.body)
  // const {user} = JSON.parse(event.body)
  const {cognitoIdentityId} = event.requestContext.identity;
  const updatedTopic = await (await Topic.findById(topic)).populate('subscriptions').execPopulate()
  if(!updatedTopic) {
    throw new Error('There is no such topic in database')
  }

  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  const parts = authProvider.split(':');
  const userPoolUserId = parts[parts.length - 1];

  const ownerOfTopic = await User.findOne({cognitoId: userPoolUserId}).exec()
  if(!ownerOfTopic || !ownerOfTopic.accountType || ownerOfTopic.accountType.toLowerCase() !== UserAccountType.ADMIN.toLowerCase()) {
    throw new Error('Permission denied.')
  }
  if(updatedTopic.owner !== ownerOfTopic._id) {
    throw new Error('Not owner of topic.')
  }
  const params = {
    Message: message,
    TopicArn: updatedTopic.arn,
  };

  const publishAwsNotif = await new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  const newNotification = new Notification({
    messageId: publishAwsNotif.MessageId,
    topic: updatedTopic,
    subscriptions: updatedTopic.subscriptions,
    message: message,
  })
  await updatedTopic.update(
    {
      $push: {
        notifications: newNotification,
      }
    })
  return await newNotification.save()
}

export const handler = provideDb(createNotification)
