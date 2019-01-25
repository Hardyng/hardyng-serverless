import * as AWS from 'aws-sdk'

AWS.config.update({region: 'eu-west-1'})

export function sendSms ({
                           phoneNumber,
                           message
                         }) {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  }
  return new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise()
}
