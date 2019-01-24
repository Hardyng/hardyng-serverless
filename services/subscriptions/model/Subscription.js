import mongoose from 'mongoose'

var Schema = mongoose.Schema;
export const SubscriptionSchema = new Schema({
  topic: Schema.Types.ObjectId,
  user: Schema.Types.ObjectId,
  notifications: [Schema.Types.ObjectId],
  active: {
    type: Boolean,
    default: true,
  },
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
