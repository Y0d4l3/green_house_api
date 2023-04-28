const mongoose = require("mongoose");

const temperatureReadingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ["C"], default: "C" },
});

const humidityReadingSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  unit: { type: String, enum: ["%"], default: "%" },
});

const lightReadingSchema = new mongoose.Schema({
  visible_plus_ir_value: { type: Number, required: true },
  infrared_value: { type: Number, required: true },
  unit: { type: String, enum: ["Lux"], default: "Lux" },
});

const sensorDataSchema = new mongoose.Schema({
  temperatureReading: { type: temperatureReadingSchema, required: true },
  HumidityReading: { type: humidityReadingSchema, required: true },
  LightReading: { type: lightReadingSchema, required: true },
  timestamp: { type: Date, default: Date.now },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
