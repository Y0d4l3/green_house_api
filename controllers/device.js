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
  Device.findOneAndUpdate(
    {
      Id: req.body.Id,
      user: req.user.id,
    },
    { name: req.body.name, location: req.body.location }
  )
    .then(function () {
      res.status(200).json({ message: "successfully updated" });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
};

exports.deleteDevice = async (req, res) => {
  Device.findByIdAndDelete(req.body.Id)
    .then(function () {
      res.status(200).json({ message: "successfully deleted" });
    })
    .catch(function (err) {
      res.status(500).json(err);
    });
};
