const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  updateTaskStatus
} = require("../controllers/taskController");

const {
  protect
} = require("../middleware/authMiddleware");


// CREATE TASK
router.post(
  "/",
  protect,
  createTask
);


// GET TASKS
router.get(
  "/:projectId",
  protect,
  getTasks
);


// UPDATE TASK STATUS
router.put(
  "/:id",
  protect,
  updateTaskStatus
);

module.exports = router;