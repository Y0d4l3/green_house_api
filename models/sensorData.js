const mongoose = require("mongoose");
const temperatureReading = require("./temperatureReading");
const humidityReading = require("./humidityReading");
const lightReading = require("./lightReading");

const sensorDataSchema = new mongoose.Schema({
  temperatureReading: temperatureReading,
  HumidityReading: humidityReading,
  LightReading: lightReading,
  timestamp: { type: Date, default: Date.now },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
