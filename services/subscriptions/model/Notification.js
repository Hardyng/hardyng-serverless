import mongoose from 'mongoose'

var Schema = mongoose.Schema;
export const NotificationSchema = new Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic'
  },
  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],
  createdTimeStamp: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    default: 'Message from hardyng.com'
  }
})
