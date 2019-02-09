async function getTopic({ Topic, event, ...props }) {
  console.log(event.queryStringParameters);
  const query = {
    _id: event.pathParameters.id
  };
  var topic = await Topic.findOne(query);
  if (!event.queryStringParameters) {
    return topic;
  }
  if (event.queryStringParameters.notifications) {
    topic = topic.populate("notifications");
  }
  if (event.queryStringParameters.subscriptions) {
    topic = topic.populate("subscriptions");
  }
  return await topic.execPopulate();
}
export default getTopic;
