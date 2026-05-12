const express = require("express");

const router = express.Router();

const {
  punchIn,
  punchOut,
  getAttendance
} = require("../controllers/attendanceController");

const { protect } = require("../middleware/authMiddleware");

router.post("/punchin", protect, punchIn);

router.post("/punchout", protect, punchOut);

router.get("/status", protect, getAttendance);

module.exports = router;