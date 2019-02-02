import { provideDb, provideLoggedUser } from './lib/curried'
import { getUserFromDb } from './lib/getUserFromDb';
async function me({ LoggedUser, User, event, ...props }) {
  return await LoggedUser.populate('subscriptions').populate('topics').execPopulate()
}
export const handler = provideDb(getUserFromDb(me))
