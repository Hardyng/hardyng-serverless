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
  firstname: {
    type: String,
  },
  birth: {
    type: Date,
  },
  city: {
    type: String,
  },
});
