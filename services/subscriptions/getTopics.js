import { provideDb } from './lib/curried'
async function getTopics({ Topic, event, ...props }) {
  console.log(event.queryStringParameters)
  const query = {}
  if (event.queryStringParameters) {
    if (event.queryStringParameters.userId) {
      query['owner'] = event.queryStringParameters.userId
    }
  }
  return await Topic.find(query).exec();
}
export const handler = provideDb(getTopics);
