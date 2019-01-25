import { provideDb } from './lib/curried'

async function createNotification ({Notification, Topic, User, Subscription, event, ...props}) {
  const {topic, message} = JSON.parse(event.body)
  const {user} = JSON.parse(event.body);
  // const {cognitoIdentityId} = event.requestContext.identity;
  const updatedTopic = await Topic.findById(topic)
  // const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()

  const newNotification = new Notification({
    topic: updatedTopic,
    subscriptions: await updatedTopic.populate('subscriptions').execPopulate(),
    message: message,
  })
  await updatedTopic.update(
    {
      $push: {
        notifications: newNotification,
      }
    });
  return await newNotification.save()
}

export const handler = provideDb(createNotification)
