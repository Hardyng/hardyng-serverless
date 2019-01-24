import { provideDb } from './lib/curried'

async function createSubscription ({Topic, User, Subscription, event, ...props}) {
  console.log(event.requestContext.identity.cognitoIdentityId)
  const {topic} = JSON.parse(event.body)
  // const {user} = JSON.parse(event.body);
  const {cognitoIdentityId} = event.requestContext.identity;
  // const updatedUser = await User.findOne({cognitoId: user}).exec()
  const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()
  const subscription = new Subscription({
    topic,
    user: updatedUser,
  })
  console.log(user)
  console.log(updatedUser)
  await (await Topic.findById(topic)).update(
    {
      $push: {
        subscriptions: subscription,
      }
    });
  await updatedUser.update({
    $push: {
      subscriptions: subscription
    }
  })
  return await subscription.save()
}

export const handler = provideDb(createSubscription)
