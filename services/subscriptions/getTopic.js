import { provideDb } from "./lib/curried";
async function getTopic({ Topic, event, ...props }) {
  console.log(event.queryStringParameters);
  const query = {
    _id: event.pathParameters.id
  };
  return await (await Topic.findOne(query))
    .populate("notifications")
    .execPopulate();
}
export const handler = provideDb(getTopic);
