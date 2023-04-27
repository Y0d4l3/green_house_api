const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  createDevice,
  getDevices,
  getDevice,
} = require("../controllers/device");

router.post("/device", isAuthenticated, createDevice, function (req, res) {});
router.get("/device", isAuthenticated, getDevice, function (req, res) {});
router.get("/devices", isAuthenticated, getDevices, function (req, res) {});

module.exports = router;
