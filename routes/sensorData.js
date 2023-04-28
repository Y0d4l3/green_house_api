const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares/auth");
const passport = require("passport");
const {
  createSensorData,
  getSensorData,
} = require("../controllers/sensorData");

router.post(
  "/sensorData",
  passport.authenticate("jwt", { session: false }),
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
