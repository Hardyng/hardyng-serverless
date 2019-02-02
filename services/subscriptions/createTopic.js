import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
import { UserAccountType } from './lib/UserAccountType'
import { getUserFromDb } from './lib/getUserFromDb';
AWS.config.update({ region: 'us-east-1' })
async function createTopic({ Topic, LoggedUser, event, ...props }) {
  const { name, description } = JSON.parse(event.body);
  if (LoggedUser.accountType.toLowerCase() !== UserAccountType.ADMIN.toLowerCase()) {
    throw new Error('Only admin can create topics.')
  }
  const awsTopic = await new AWS.SNS({ apiVersion: '2010-03-31' }).createTopic({ Name: name }).promise();
  const newTopic = new Topic({
    name,
    description,
    owner: LoggedUser._id,
    arn: awsTopic.TopicArn
  })
  await LoggedUser.update({
    $push: {
      topics: newTopic
    }
  }).exec()

  return await newTopic.save()
}
export const handler = provideDb(getUserFromDb(createTopic))
