const mongoose = require("mongoose");

const humidityReadingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ["%"], default: "%" },
  timestamp: { type: Date, required: true },
  device: { type: mongoose.Schema.Types.ObjectId, ref: "Device" },
});

module.exports = mongoose.model("Humidity", humidityReadingSchema);
