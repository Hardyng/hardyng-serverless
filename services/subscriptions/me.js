import { provideDb } from './lib/curried'
async function me ({User, event, ...props}) {
  // event.requestContext.identity.cognitoIdentityId
  const cognitoId = event.requestContext.identity.cognitoIdentityId
  return await (await User.findOne({cognitoId})).populate('subscriptions').populate('topics').execPopulate()
}
export const handler = provideDb(me)
