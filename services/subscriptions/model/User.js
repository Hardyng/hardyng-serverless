import { UserAccountType } from '../lib/UserAccountType'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

export const UserConfig = {
  topicsMax: {
    [UserAccountType.DEFAULT]: 2,
    [UserAccountType.PREMIUM]: 10,
    [UserAccountType.ADMIN]: Infinity
  },
  subscriptionsMax: {
    [UserAccountType.DEFAULT]: 2,
    [UserAccountType.PREMIUM]: 10,
    [UserAccountType.ADMIN]: Infinity
  },
  notificationsMax: {
    [UserAccountType.DEFAULT]: 10,
    [UserAccountType.PREMIUM]: 100,
    [UserAccountType.ADMIN]: Infinity
  }
}

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cognitoId: {
    type: String
  },
  accountType: {
    type: String,
    enum: Object.values(UserAccountType),
    default: 'default'
  },
  phoneNumber: {
    type: String,
  },
  firstName: {
    type: String,
  },
  birth: {
    type: Date,
  },
  city: {
    type: String,
  },
  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],
  topics: [{
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  }],
});
