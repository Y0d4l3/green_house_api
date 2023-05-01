const Device = require("../models/device");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getDevices = async (req, res) => {
  try {
    const devices = Device.find({ user: req.user });
    if (!devices) {
      return res.status(409).json({ message: "No devices found" });
    }
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.createDevice = async (req, res) => {
  try {
    const existingDevice = await Device.findOne({
      name: req.body.deviceName,
      user: req.user.id,
    });
    if (existingDevice) {
      return res
        .status(409)
        .json({ message: "Device with that name already exists" });
    }
    const newDevice = new Device({
      name: req.body.deviceName,
      location: req.body.deviceLocation,
      user: req.user.id,
    });
    apiToken = jwt.sign({ deviceId: newDevice.id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    newDevice.apiToken = apiToken;
    const savedDevice = await newDevice.save();
    if (!savedDevice) {
      return res.status(404).json({ message: "Device could not be saved" });
    }
    res.status(201).json(savedDevice);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.updateDevice = async (req, res) => {
  try {
    const updatedDevice = await Device.findOneAndUpdate(
      {
        Id: req.body.deviceId,
        user: req.user.id,
      },
      { name: req.body.deviceName, location: req.body.deviceLocation }
    );
    if (!updatedDevice) {
      return res.status(409).json({ message: "Device not found" });
    }
    res.status(200).json(updatedDevice);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.body.deviceId);
    if (!deletedDevice) {
      return res.status(409).json({ message: "Device not found" });
    }
    res.status(200).json(deletedDevice);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
