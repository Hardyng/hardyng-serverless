// TODO : Implement when serverless add working cognito hooks
// const AWS = require('aws-sdk')
// const cognito = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'})
async function createUser({ User, event, context, callback }) {
  console.log(event);
  const newUser = await new User({
    cognitoId: event.userName,
    username: event.userName,
    email: event.request.userAttributes.email
  }).save();
  console.log(newUser);
  console.log(
    "User confirmed: User-Pool",
    event.userPoolId + ", UserId: " + event.userName
  );
  callback(null, event);
  // return event;
}

export default createUser;
