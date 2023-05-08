const { json } = require("body-parser");
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
  try {
    const latestSensorData = await this.constructor
      .find({ device: doc.device })
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
      const iftttUri =
        "https://maker.ifttt.com/trigger/{event}/json/with/key/{key}";
      const options = {
        url: iftttUri
          .replace("{event}", process.env.IFTTT_EVENT)
          .replace("{key}", process.env.IFTTT_KEY),
        method: "POST",
        json: {
          deviceName: doc.device.name,
          latestTemperatureReading: latestTemperatureReading,
          previousTemperatureReading: previousTemperatureReading,
        },
      };
      request(options, (err, res, body) => {
        if (err) {
          console.error(err);
        }
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
