import * as AWS from "aws-sdk";
import { UserConfig } from "../../model/User";
AWS.config.update({ region: "us-east-1" });
async function createSubscription({
  LoggedUser,
  Topic,
  User,
  Subscription,
  event,
  ...props
}) {
  const { topic, subscriptionType } = JSON.parse(event.body);
  const updatedTopic = await Topic.findById(topic);
  if (!updatedTopic) {
    throw new Error("There is no such topic in database");
  }
  if (
    LoggedUser.subscriptions.length >=
    UserConfig.subscriptionsMax[LoggedUser.accountType]
  ) {
    throw new Error("User reached maximum of subscriptions per account.");
  }
  var params = {};
  switch (subscriptionType.toLowerCase()) {
    case "sms":
      params = {
        Protocol: "SMS",
        TopicArn: updatedTopic.arn,
        Endpoint: LoggedUser.phoneNumber
      };
    case "email":
      params = {
        Protocol: "email",
        TopicArn: updatedTopic.arn,
        Endpoint: LoggedUser.email,
        ReturnSubscriptionArn: true
      };
  }
  var awsSub = await new AWS.SNS({ apiVersion: "2010-03-31" })
    .subscribe(params)
    .promise();

  const newSubscription = new Subscription({
    topic,
    user: LoggedUser._id,
    arn: awsSub.SubscriptionArn,
    type: subscriptionType.toLowerCase()
  });
  await updatedTopic.update({
    $push: {
      subscriptions: newSubscription
    }
  });
  await LoggedUser.update({
    $push: {
      subscriptions: newSubscription
    }
  });
  return await newSubscription.save();
}

export default createSubscription;
