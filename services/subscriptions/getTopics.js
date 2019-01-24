import { provideDb } from './lib/curried'
async function getTopics ({Topic, event, ...props}) {
  return await Topic.find().exec();
}
export const handler = provideDb(getTopics);
