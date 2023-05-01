const Device = require("../models/device");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.getDevices = async (req, res) => {
  Device.find({ user: req.user.id })
    .then(function (devices) {
      res.status(200).json(devices);
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
};

exports.createDevice = (req, res) => {
  Device.findOne({ name: req.body.name, user: req.user.id })
    .then((existingDevice) => {
      if (existingDevice) {
        return res
          .status(409)
          .json({ message: "device with the same name already exists" });
      }
      const newDevice = new Device({
        name: req.body.name,
        location: req.body.location,
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

exports.updateDevice = async (req, res) => {
  try {
    const updatedDevice = await Device.findOneAndUpdate(
      {
        Id: req.body.Id,
        user: req.user.id,
      },
      { name: req.body.name, location: req.body.location }
    );
    if (!updatedDevice) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    res.status(200).json(updatedDevice);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const deletedDevice = await Device.findByIdAndDelete(req.body.Id);
    if (!deletedDevice) {
      res.status(404).json({ message: "Device not found" });
      return;
    }
    res.status(200).json(deletedDevice);
  } catch (err) {
    res.status(500).json(err);
  }
};
