const TemperatureReading = require("../models/temperatureReading");
const Device = require("../models/device");

const today = new Date();
const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

exports.getTemperatureReadings = async (req, res) => {
  const { deviceName } = req.body;
  Device.findOne({ name: deviceName, user: req.user.id })
    .then(async (existingDevice) => {
      if (existingDevice) {
        return res.status(409).json("device not found");
      }
      const TemperatureReadings = await TemperatureReading.find({
        device: existingDevice,
        timestamp: { $gte: twentyFourHoursAgo },
      });
      res.status(201).json(TemperatureReadings);
    })
    .catch((err) => res.status(500).json(err));
};

exports.createTemperatureReading = (req, res) => {
  const { value } = req.body;
  Device.findOne({ apiToken: req.deviceName })
    .then(async (existingDevice) => {
      if (existingDevice) {
        const newTemperatureReading = new TemperatureReading({
          value,
          device: existingDevice.id,
        });
        newTemperatureReading
          .save()
          .then((savedTemperatureReading) => {
            res.status(201).json(savedTemperatureReading);
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
};
