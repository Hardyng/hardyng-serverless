import { IS_PRODUCTION } from '../config'
export async function getUser({ event, User }) {
  let cognitoId = null
  if (IS_PRODUCTION) {
    const authProvider = event.requestContext.identity.cognitoAuthenticationProvider
    const parts = authProvider.split(':')
    const userPoolIdParts = parts[parts.length - 3].split('/')
    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1]
    const userPoolUserId = parts[parts.length - 1]
    cognitoId = userPoolUserId
  } else {
    cognitoId = '12aad149-c638-48f5-8305-e462625cea9a'
  }
  const loggedUser = await User.findOne({ cognitoId })
  if (!loggedUser) {
    throw new Error('Cannot find user.')
  }
  return loggedUser
}