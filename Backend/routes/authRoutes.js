const express = require("express");

const router = express.Router();

const {
  signup,
  login
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/signup", signup);

router.post("/login", login);


// Protected route test
router.get("/profile", protect, (req, res) => {

  res.json({
    message: "Protected route accessed",
    user: req.user
  });

});

module.exports = router;