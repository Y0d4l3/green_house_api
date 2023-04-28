const SensorData = require("../models/sensorData");
const Device = require("../models/device");

const today = new Date();
const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

exports.getSensorData = async (req, res) => {
  const { deviceName } = req.query;
  Device.findOne({ name: deviceName, user: req.user }).then(
    async (existingDevice) => {
      if (!existingDevice) {
        return res.status(409).json("device not found");
      }
      const SensorReadings = await SensorData.find({
        device: existingDevice,
        timestamp: { $gte: twentyFourHoursAgo },
      });
      return res.status(200).json(SensorReadings);
    }
  );
  return res.status(500);
};

exports.createSensorData = (req, res) => {
  Device.findById(req.deviceId)
    .then(async (existingDevice) => {
      if (existingDevice) {
        req.body.device = existingDevice;
        const newSensorData = new SensorData(req.body);
        newSensorData
          .save()
          .then((savedSensorData) => {
            res.status(201).json(savedSensorData);
          })
          .catch((err) => res.status(500).json(err));
      }
    })
    .catch((err) => res.status(500).json(err));
  return res.status(500);
};
