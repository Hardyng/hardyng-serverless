import mongoose from 'mongoose'

var Schema = mongoose.Schema;
export const SubscriptionSchema = new Schema({
  arn: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['sms', 'email'],
    required: true
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  notifications: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  createdTimeStamp: {
    type: Date,
    default: Date.now
  },
  lastMessageTimestamp: {
    type: Date,
    default: null,
  },
  settings: {
    minNotificationThrottle: {
      type: String,
      enum: ['1d', '3d'],
      default: "1d"
    }
  }
})
