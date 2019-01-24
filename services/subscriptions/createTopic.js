import { provideDb } from './lib/curried'

async function createTopic ({Topic, User, event, ...props}) {
  console.log(event.requestContext.identity.cognitoIdentityId)
  const {name, description} = JSON.parse(event.body);
  return await new Topic({
    name,
    description,
    owner: await User.findOne({cognitoId: event.requestContext.identity.cognitoIdentityId}),
  }).save()
}
export const handler = provideDb(createTopic)
