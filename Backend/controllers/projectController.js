const Project = require("../models/Project");

const User = require("../models/User");


// CREATE PROJECT
const createProject = async (req, res) => {

  try {

    const { title, description } = req.body;

    const project = await Project.create({

      title,
      description,

      admin: req.user.id,

      members: [req.user.id]

    });


    // MAKE USER ADMIN
    await User.findByIdAndUpdate(
      req.user.id,
      {
        role: "admin"
      }
    );


    res.status(201).json({
      message: "Project created successfully",
      project
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// GET USER PROJECTS
const getProjects = async (req, res) => {

  try {

    const projects = await Project.find({
      members: req.user.id
    })
    .populate("members", "name email")
    .populate("admin", "name email");

    res.status(200).json(projects);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  createProject,
  getProjects
};