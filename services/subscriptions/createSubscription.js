import { provideDb } from './lib/curried'

async function createSubscription ({Topic, User, Subscription, event, ...props}) {
  const {topic} = JSON.parse(event.body)
  const {user} = JSON.parse(event.body);
  // const {cognitoIdentityId} = event.requestContext.identity;
  const updatedUser = await User.findOne({cognitoId: user}).exec()
  // const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()
  const newSubscription = new Subscription({
    topic,
    user: updatedUser,
  })
  const updatedTopic = await Topic.findById(topic);
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
