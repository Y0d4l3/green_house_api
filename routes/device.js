const { loginRequired } = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const { createDevice, getDevices } = require("../controllers/device");

router.post("/device", createDevice, loginRequired, function (req, res) {});
router.get("/devices", getDevices, loginRequired, function (req, res) {});

module.exports = router;
