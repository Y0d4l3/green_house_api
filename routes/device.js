const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
} = require("../controllers/device");

router.post("/device", isAuthenticated, createDevice, function (req, res) {});
router.get("/devices", isAuthenticated, getDevices, function (req, res) {});
router.patch("/device", isAuthenticated, updateDevice, function (req, res) {});
router.delete("/device", isAuthenticated, deleteDevice, function (req, res) {});

module.exports = router;
