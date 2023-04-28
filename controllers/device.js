const { application } = require("express");
const Device = require("../models/device");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user.id });
    res.status(200).json(devices);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getDevice = async (req, res) => {
  const { name } = req.body;
  try {
    const device = await Device.findOne({ name: name, user: req.user.id });
    res.status(200).json(device);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createDevice = (req, res) => {
  const { name, location } = req.body;
  Device.findOne({ name: name, user: req.user.id })
    .then((existingDevice) => {
      if (existingDevice) {
        return res
          .status(409)
          .json({ message: "device with the same name already exists" });
      }
      const newDevice = new Device({
        name,
        location,
        user: req.user.id,
      });
      apiToken = jwt.sign({ deviceId: newDevice.id }, process.env.JWT_SECRET, {
        expiresIn: "365d",
      });
      newDevice.apiToken = apiToken;
      newDevice
        .save()
        .then((savedDevice) => {
          res.status(201).json(savedDevice);
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
};
