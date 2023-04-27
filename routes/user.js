const express = require("express");
const passport = require("passport");
const router = express.Router();

router.post("/signin", function (req, res, next) {
  passport.authenticate("signin", function (error, user, info) {
    if (user) {
      req.logIn(user, function (error) {
        if (error) {
          return res.status(401).json({ message: error });
        }
        return res.status(200).json({ message: "signed in succesfull" });
      });
    }
    if (error) {
      return res.status(500).json(error);
    }
    if (info) {
      return res.status(401).json({ message: info });
    }
  })(req, res, next);
});

router.post("/signup", function (req, res, next) {
  passport.authenticate("signup", function (error, user, info) {
    if (user) {
      return res.status(200).json({ message: "signed up succesfull" });
    }
    if (error) {
      return res.status(500).json({ message: error });
    }
    if (info) {
      return res.status(401).json({ message: info.message });
    }
  })(req, res, next);
});

router.post("/signout", function (req, res, next) {
  req.logout(function (error) {
    if (error) {
      return res.status(500).json({ message: error });
    }
    req.session.destroy(function (error) {
      if (error) {
        return res.status(500).json({ message: error });
      }
    });
    return res.status(200).json({ message: "signed out succesfull" });
  });
});

module.exports = router;
