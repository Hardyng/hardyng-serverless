export const getUserFromDb = function getUserFromDb(fn) {
  return async function ({ event, User, ...props }) {
    const LoggedUser = await getUser({ event, User })
    return await fn({ LoggedUser, User, event, ...props })
  }
}