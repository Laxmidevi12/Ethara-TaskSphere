const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");


// Create project
router.post("/", protect, createProject);


// Get user projects
router.get("/", protect, getProjects);

module.exports = router;