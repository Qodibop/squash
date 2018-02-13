const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  localisation: String,
  day: String,
  time: String
});

module.exports = mongoose.model("Search", searchSchema);
