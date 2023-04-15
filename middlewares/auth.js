const jwt = require("jsonwebtoken");
require("dotenv").config();
const Device = require("../models/device");

exports.loginRequired = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json("unauthorized");
  }
  next();
};

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json("no authorization header found");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const existingDevice = await Device.findById(decoded.deviceId);
    if (!existingDevice) {
      return res.status(404).json("Device not found");
    }
    req.deviceName = existingDevice.name;
    next();
  } catch (error) {
    res.status(500).json(error);
  }
};
