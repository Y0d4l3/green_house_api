const mongoose = require("mongoose");
const request = require("request");
require("dotenv").config();

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
  humidityReading: { type: humidityReadingSchema, required: true },
  lightReading: { type: lightReadingSchema, required: true },
  timestamp: { type: Date, default: Date.now },
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
    required: true,
  },
});

sensorDataSchema.post("save", async function (doc, next) {
  console.log("test");
  try {
    const latestSensorData = await sensorDataSchema
      .find()
      .sort("-timestamp")
      .limit(2);
    const latestTemperatureReading =
      latestSensorData[0].temperatureReading.value;
    const previousTemperatureReading =
      latestSensorData[1].temperatureReading.value;

    if (
      Math.abs(latestTemperatureReading - previousTemperatureReading) >
      process.env.TEMPERATURE_TRESHHOLD
    ) {
      request(process.env.IFTTT_URI, { json: true }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
        console.log(body.url);
        console.log(body.explanation);
      });
      return next();
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = mongoose.model("SensorData", sensorDataSchema);
