const express = require("express");
const router = express.Router();
const { registerUser, logoutUser, loginUser } = require("../controllers/user");

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.post("/register", registerUser);

module.exports = router;
