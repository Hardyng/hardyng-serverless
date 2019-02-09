import * as AWS from "aws-sdk";
AWS.config.update({ region: "us-east-1" });
async function createTopic({ Topic, LoggedUser, event, ...props }) {
  const { name, description } = JSON.parse(event.body);
  if (
    LoggedUser.topics.length >= UserConfig.topicsMax[LoggedUser.accountType]
  ) {
    throw new Error("User reached maximum of topics per account.");
  }
  const awsTopic = await new AWS.SNS({ apiVersion: "2010-03-31" })
    .createTopic({ Name: name })
    .promise();
  const newTopic = new Topic({
    name,
    description,
    owner: LoggedUser._id,
    arn: awsTopic.TopicArn
  });
  await LoggedUser.update({
    $push: {
      topics: newTopic
    }
  }).exec();

  return await newTopic.save();
}
export default createTopic;
