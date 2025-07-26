const express = require("express");
const router = express.Router();;
const User = require("../models/user");
const passport = require("passport");

// Show Register Form
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

// GET: Logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/listings");
  });
});


// Show Login Form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

// Login Logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/listings");
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/listings");
  });
});

module.exports = router;
