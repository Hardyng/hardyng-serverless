import mongoose from 'mongoose'

var Schema = mongoose.Schema;
export const TopicSchema = new Schema({
    name: {
      type: String,
      default: 'This is default topic name.'
    },
    description: {
      type: String,
      default: 'This is default topic description.',
    },
    subscriptions: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    owner: Schema.Types.ObjectId,
  })
