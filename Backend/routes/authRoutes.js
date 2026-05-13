const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  getUsers
} = require("../controllers/authController");

const {
  protect
} = require("../middleware/authMiddleware");


// SIGNUP
router.post("/signup", signup);

// LOGIN
router.post("/login", login);


// GET USERS
router.get(
  "/users",
  protect,
  getUsers
);


// Protected route test
router.get(
  "/profile",
  protect,
  (req, res) => {

    res.json({
      message:
        "Protected route accessed",
      user: req.user
    });

  }
);

module.exports = router;
