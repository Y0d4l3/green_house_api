const { verifyToken, loginRequired } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const {
  createHumidityReading,
  getHumidityReadings,
} = require("../controllers/humidityReading");

router.post(
  "/humidityReading",
  createHumidityReading,
  verifyToken,
  function (req, res) {}
);
router.get(
  "/humidityReadings",
  getHumidityReadings,
  loginRequired,
  function (req, res) {}
);

module.exports = router;
