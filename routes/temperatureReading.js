const { verifyToken, loginRequired } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const {
  createTemperatureReading,
  getTemperatureReadings,
} = require("../controllers/temperatureReading");

router.post(
  "/temperatureReading",
  createTemperatureReading,
  verifyToken,
  function (req, res) {}
);
router.get(
  "/temperatureReadings",
  getTemperatureReadings,
  loginRequired,
  function (req, res) {}
);

module.exports = router;
