const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  username: { type: String, ref: "User.username" },
  userPic: { type: String, ref: "User.picPath" },
  address: String,
  zipcode: String,
  localisation: String,
  day: String,
  time: String
});

module.exports = mongoose.model("Search", searchSchema);
