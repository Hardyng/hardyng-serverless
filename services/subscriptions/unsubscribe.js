import { provideDb } from './lib/curried'

async function unsubscribe ({User, Subscription, event, ...props}) {
  const {topic} = JSON.parse(event.body)
  const {user} = JSON.parse(event.body)
  // const {cognitoIdentityId} = event.requestContext.identity;
  const updatedUser = await User.findOne({cognitoId: user}).exec()
  // const updatedUser = await User.findOne({cognitoId: cognitoIdentityId}).exec()
  console.log(updatedUser);
  return await Subscription.findOneAndDelete(
    {
      topic: topic,
      user: updatedUser,
    }).exec()
}

export const handler = provideDb(unsubscribe)
