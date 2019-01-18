import mongoose from 'mongoose'

var Schema = mongoose.Schema;
export const TopicSchema = new Schema({
    name: String,
    subscribers: [Schema.Types.ObjectId],
    owner: Schema.Types.ObjectId,
  })
