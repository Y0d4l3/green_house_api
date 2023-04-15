const mongoose = require("mongoose");

const temperatureReadingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ["C", "F"], default: "C" },
  timestamp: { type: Date, default: Date.now },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
});

module.exports = mongoose.model("TemperatureReading", temperatureReadingSchema);
