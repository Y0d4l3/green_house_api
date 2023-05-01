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
    const device = await Device.findOneAndUpdate(
      {
        Id: req.body.Id,
        user: req.user.id,
      },
      { name: req.body.name, location: req.body.location }
    );
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    console.log(req);
    const device = await Device.findByIdAndDelete(req.body.Id);
    res.status(200).json(device);
  } catch (err) {
    res.status(500).json(err);
  }
};
