import { provideDb } from './lib/curried'
async function me ({User, event, ...props}) {
  // event.requestContext.identity.cognitoIdentityId
  const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  // cognito authentication provider looks like:
  // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx:CognitoSignIn:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const parts = authProvider.split(':');
  const userPoolIdParts = parts[parts.length - 3].split('/');
  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  // const cognitoId = event.requestContext.identity.cognitoIdentityId
  const cognitoId = userPoolUserId
  return await (await User.findOne({cognitoId})).populate('subscriptions').populate('topics').execPopulate()
}
export const handler = provideDb(me)
