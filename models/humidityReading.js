const mongoose = require("mongoose");

const humidityReadingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ["%"], default: "%" },
});

module.exports = mongoose.model("Humidity", humidityReadingSchema);
