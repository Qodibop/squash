const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facilitySchema = new Schema({
  facilityemail: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  name: String,
  // location: { type: { type: String }, coordinates: [Number] },
  address: String,
  postalCode: Number,
  phone: String,
  description: String,
  // openingDays: { day: { openingHour: Number, closingHour: Number } },
  openingDays: String,
  website: String,
  facilityType: String
});

// facilitySchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Facility", facilitySchema);
