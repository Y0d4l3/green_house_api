const Device = require("../models/device");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send("Not logged in");
};

exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("No authorization header found");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const existingDevice = await Device.findById(decoded.deviceId);
    if (!existingDevice) {
      return res.status(404).send("Device not found");
    }
    req.deviceName = existingDevice.name;
    next();
  } catch (error) {
    return res.status(500).send(error);
  }
};
