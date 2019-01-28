import { calculateCost } from "../../lib/billing-lib";
import { success, failure } from "../../lib/response-lib";
import { provideDb } from './lib/curried'
var paypal = require('paypal-rest-sdk');
async function userPays({User, event}) {
  const {cognitoIdentityId} = event.requestContext.identity
  const cognitoId = cognitoIdentityId
  const payingUser = await (await User.findOne({cognitoId})).populate('subscriptions').populate('topics').execPopulate()
  if (!payingUser) {
    throw new Error('Error occured when searching for user in database')
  }
  const { paymentToken } = JSON.parse(event.body)
  throw new Error("Billing is not implemented yet.")
}

export const handler = provideDb(userPays)
