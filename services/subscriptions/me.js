import { provideDb } from './lib/curried'
async function me ({User, event, ...props}) {
  // event.requestContext.identity.cognitoIdentityId
  const cognitoId = '6d1303ac-0c14-4647-82ab-69b1818387ad';
  return await (await User.findOne({cognitoId})).populate('subscriptions').populate('topics').execPopulate();
}
export const handler = provideDb(me);
