import { provideDb } from "./lib/curried";
import * as AWS from "aws-sdk";
import { UserAccountType } from "./lib/UserAccountType";
import { getUserFromDb } from "./lib/getUserFromDb";
import { UserConfig } from "./model/User";
AWS.config.update({ region: "us-east-1" });

async function createNotification({
  Notification,
  Topic,
  LoggedUser,
  Subscription,
  event,
  ...props
}) {
  const { topic, message } = JSON.parse(event.body);
  const updatedTopic = await (await Topic.findById(topic))
    .populate("subscriptions")
    .execPopulate();
  if (!updatedTopic) {
    throw new Error("There is no such topic in database");
  }

  if (updatedTopic.owner.toString() !== LoggedUser._id.toString()) {
    throw new Error("Not owner of topic.");
  }
  // if (LoggedUser.notifications.length >= UserConfig.notificationsMax[LoggedUser.accountType]) {
  //   throw new Error('User reached maximum of notifications per account.')
  // }
  const params = {
    Message: message,
    TopicArn: updatedTopic.arn
  };

  const publishAwsNotif = await new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise();
  const newNotification = new Notification({
    messageId: publishAwsNotif.MessageId,
    topic: updatedTopic,
    subscriptions: updatedTopic.subscriptions,
    message: message
  });
  await updatedTopic.update({
    $push: {
      notifications: newNotification
    }
  });
  return await newNotification.save();
}

export const handler = provideDb(getUserFromDb(createNotification));
