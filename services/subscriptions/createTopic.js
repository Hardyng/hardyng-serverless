import { provideDb } from './lib/curried'

async function createTopic ({Topic, User, event, ...props}) {
  const {name, description} = JSON.parse(event.body);
  const {user} = JSON.parse(event.body);
  const owner = await User.findOne({cognitoId: user});
  // const owner = await User.findOne({cognitoId: event.requestContext.identity.cognitoIdentityId});
  const newTopic = new Topic({
    name,
    description,
    owner
  })
  await owner.update({
    $push: {
      topics: newTopic
    }
  }).exec()
  return await newTopic.save()
}
export const handler = provideDb(createTopic)
