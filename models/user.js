const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  email: String,
  picPath: String,
  picName: String,
  address: String
});

module.exports = mongoose.model("User", userSchema);
