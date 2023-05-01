const SensorData = require("../models/sensorData");
const Device = require("../models/device");

const today = new Date();
const twentyFourHoursAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

exports.getSensorData = async (req, res) => {
  try {
    const device = await Device.findOne({
      Id: req.body.deviceId,
      user: req.user,
    });
    if (!device) {
      return res.status(409).json({ message: "Device not found" });
    }
    const sensorData = await SensorData.find({
      device: device,
      timestamp: { $gte: twentyFourHoursAgo },
    });
    if (!sensorData) {
      return res.status(409).json({ message: "No sensor data not found" });
    }
    res.status(200).json(sensorData);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

exports.createSensorData = async (req, res) => {
  try {
    const device = await Device.findById(req.deviceId);
    if (!device) {
      return res.status(409).json({ message: "Device not found" });
    }
    const newSensorData = new SensorData(req.body);
    const savedSensorData = await newSensorData.save();
    if (!savedSensorData) {
      return res
        .status(404)
        .json({ message: "Sensor data could not be saved" });
    }
    res.status(201).json(savedSensorData);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
