const express = require("express");
const router = express.Router();
const { verifyToken, isAuthenticated } = require("../middlewares/auth");
const {
  createSensorData,
  getSensorData,
} = require("../controllers/sensorData");

router.post(
  "/sensorData",
  verifyToken,
  createSensorData,
  function (req, res) {}
);
router.get(
  "/sensorData",
  isAuthenticated,
  getSensorData,
  function (req, res) {}
);

module.exports = router;
