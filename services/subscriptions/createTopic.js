import { provideDb } from './lib/curried'

async function createTopic ({Topic, User, event, ...props}) {
  console.log(event.requestContext.identity.cognitoIdentityId)
  return await new Topic({
    name: 'testowy topic',
    owner: await User.findOne({cognitoId: event.requestContext.identity.cognitoIdentityId}),
  }).save()
}
export const handler = provideDb(createTopic)
