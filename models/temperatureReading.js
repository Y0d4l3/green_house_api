const mongoose = require("mongoose");

const temperatureReadingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ["C", "F"], default: "C" },
});

module.exports = mongoose.model("TemperatureReading", temperatureReadingSchema);
