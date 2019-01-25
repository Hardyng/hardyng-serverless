const mongoose = require('mongoose');
const Schema = mongoose.Schema;
export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  cognitoId: {
    type: String
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
