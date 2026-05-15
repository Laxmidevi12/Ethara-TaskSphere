const express =
  require("express");

const router =
  express.Router();

const {
  punchIn,
  punchOut,
  getAttendanceStatus
} = require(
  "../controllers/attendanceController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);


// PUNCH IN
router.post(
  "/punchin",
  protect,
  punchIn
);


// PUNCH OUT
router.post(
  "/punchout",
  protect,
  punchOut
);


// STATUS
router.get(
  "/status",
  protect,
  getAttendanceStatus
);

module.exports =
  router;
