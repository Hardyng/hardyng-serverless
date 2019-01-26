import { provideDb } from './lib/curried'
import * as AWS from 'aws-sdk';
import { UserAccountType } from './lib/UserAccountType'
AWS.config.update({region: 'us-east-1'})
async function createTopic ({Topic, User, event, ...props}) {
  const {name, description} = JSON.parse(event.body);
  // const {user} = JSON.parse(event.body);
  // const owner = await User.findOne({cognitoId: user});
  const owner = await User.findOne({cognitoId: event.requestContext.identity.cognitoIdentityId});
  if(!owner || !owner.accountType || owner.accountType.toLowerCase() !== UserAccountType.ADMIN.toLowerCase()) {
    throw new Error('Permission denied.')
  }
  const awsTopic = await new AWS.SNS({apiVersion: '2010-03-31'}).createTopic({Name: name}).promise();
  const newTopic = new Topic({
    name,
    description,
    owner,
    arn: awsTopic.TopicArn
  })
  await owner.update({
    $push: {
      topics: newTopic
    }
  }).exec()

  return await newTopic.save()
}
export const handler = provideDb(createTopic)
