const HumidityReading = require("../models/humidityReading");
const Device = require("../models/device");

const today = new Date();
const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

exports.getHumidityReadings = async (req, res) => {
  const { deviceName } = req.body;
  Device.findOne({ name: deviceName, user: req.user.id })
    .then(async (existingDevice) => {
      if (existingDevice) {
        return res.status(409).json("device not found");
      }
      const HumidityReadings = await HumidityReading.find({
        device: existingDevice,
        timestamp: { $gte: twentyFourHoursAgo },
      });
      res.status(201).json(HumidityReadings);
    })
    .catch((err) => res.status(500).json(err));
};

exports.createHumidityReading = (req, res) => {
  const { value } = req.body;
  Device.findOne({ name: req.deviceName })
    .then(async (existingDevice) => {
      if (existingDevice) {
        const newHumidityReading = new HumidityReading({
          value,
          device: existingDevice.id,
        });
        newHumidityReading
          .save()
          .then((savedHumidityReading) => {
            res.status(201).json(savedHumidityReading);
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
};
