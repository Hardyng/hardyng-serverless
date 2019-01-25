// TODO : Implement when serverless add working cognito hooks
async function createUser ({User, event, context, ...props}) {
  // console.log(event.requestContext.identity.cognitoIdentityId)
  console.log('User confirmed: User-Pool', event.userPoolId+", UserId: " + event.userName);
  context.done(null, event);
}
export const handler = createUser
