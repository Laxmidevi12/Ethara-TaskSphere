// backend/routes/taskRoutes.js

const express = require("express");

const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask
} = require(
  "../controllers/taskController"
);

const {
  protect
} = require(
  "../middleware/authMiddleware"
);


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


// UPDATE TASK
router.put(
  "/:taskId",
  protect,
  updateTask
);

module.exports = router;
