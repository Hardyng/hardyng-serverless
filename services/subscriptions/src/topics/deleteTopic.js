async function deleteTopic({ Topic, LoggedUser, event, ...props }) {
  console.log(event.queryStringParameters);
  const query = {
    _id: event.pathParameters.id
  };
  if (LoggedUser.accountType !== "admin") {
    query["owner"] = LoggedUser._id;
  }
  return await Topic.findOneAndDelete(query, {
    select: {
      _id: 1
    }
  });
}
export default deleteTopic;
