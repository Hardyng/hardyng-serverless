import { provideDb } from './lib/curried'
import { sendSms } from './lib/sendSms'

async function createNotification ({Notification, Topic, User, Subscription, event, ...props}) {
  const {topic, message} = JSON.parse(event.body)
  const {user} = JSON.parse(event.body)
  // const {cognitoIdentityId} = event.requestContext.identity;
  const updatedTopic = await (await Topic.findById(topic)).populate('subscriptions').execPopulate()
  // const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()

  const newNotification = new Notification({
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
  console.log(updatedTopic.subscriptions);
  const allSmsPromises = []
  updatedTopic.subscriptions.forEach(async (subscription) => {
    console.log(subscription)
    allSmsPromises.push(sendSms(
      {
        phoneNumber: (await subscription.populate('user').execPopulate()).user.phoneNumber,
        message
      }
    ))
  })
  console.log(await Promise.all(allSmsPromises))
  return await newNotification.save()
}

export const handler = provideDb(createNotification)
