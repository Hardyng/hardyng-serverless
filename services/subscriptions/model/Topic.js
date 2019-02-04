import mongoose from "mongoose";

var Schema = mongoose.Schema;
export const TopicSchema = new Schema({
  arn: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    default: "This is default topic name."
  },
  description: {
    type: String,
    default: "This is default topic description."
  },
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
  },
  subscriptions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      default: []
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notification"
    }
  ]
});
