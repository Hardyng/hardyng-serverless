import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
import { UserAccountType } from './lib/UserAccountType'
import { getUserFromDb } from './lib/getUserFromDb';
AWS.config.update({ region: 'us-east-1' });

async function unsubscribe({ LoggedUser, User, Subscription, event, ...props }) {
  const { topic } = JSON.parse(event.body)
  const deletedSubscription = await Subscription.findOne({
    topic: topic,
    user: LoggedUser,
  })
  await new AWS.SNS({ apiVersion: '2010-03-31' }).unsubscribe({ SubscriptionArn: deletedSubscription.arn }).promise();
  return await deletedSubscription.delete()
}

export const handler = provideDb(getUserFromDb(unsubscribe))
