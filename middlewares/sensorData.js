const SensorData = require("../models/sensorData");
const request = require("request");
require("dotenv").config();

SensorData.post("save", async function (doc, next) {
  console.log("test");
  try {
    const latestSensorData = await SensorData.find()
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
