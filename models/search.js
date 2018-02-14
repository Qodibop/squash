const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  address: String,
  zipcode: String,
  localisation: String,
  day: String,
  time: String
});

module.exports = mongoose.model("Search", searchSchema);
