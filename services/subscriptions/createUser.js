import { provideDb } from './lib/curried'
import mongoose from 'mongoose';
async function createUser ({User, event, ...props}) {
  console.log(event.requestContext.identity.cognitoIdentityId)
  return await new User({
    cognitoId: event.requestContext.identity.cognitoIdentityId,
    username: 'testowy',
  }).save()
}
export const handler = provideDb(createUser)
