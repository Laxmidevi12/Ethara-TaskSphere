const Task = require("../models/Task");

const User = require("../models/User");


// CREATE TASK
const createTask = async (req, res) => {

  try {

    const {

      title,

      description,

      assignedTo,

      reviewer,

      dueDate,

      projectId

    } = req.body;


    // ONLY PROJECT LEAD
    if (
      req.user.role !== "projectlead"
    ) {

      return res.status(403).json({
        message:
          "Only Project Lead can assign tasks"
      });

    }


    const task = await Task.create({

      title,

      description,

      assignedTo,

      reviewer,

      dueDate,

      project: projectId,

      assignedBy: req.user.id

    });


    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET TASKS
const getTasks = async (req, res) => {

  try {

    let tasks = [];


    // PROJECT LEAD
    if (
      req.user.role === "projectlead"
    ) {

      tasks = await Task.find()

        .populate(
          "assignedTo",
          "name role"
        )

        .populate(
          "reviewer",
          "name"
        )

        .populate(
          "project",
          "title"
        );

    }


    // TASKER
    else if (
      req.user.role === "tasker"
    ) {

      tasks = await Task.find({

        assignedTo: req.user.id

      })

        .populate(
          "project",
          "title"
        )

        .populate(
          "reviewer",
          "name"
        );

    }


    // REVIEWER
    else if (
      req.user.role === "reviewer"
    ) {

      tasks = await Task.find({

        reviewer: req.user.id

      })

        .populate(
          "assignedTo",
          "name"
        )

        .populate(
          "project",
          "title"
        );

    }


    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// UPDATE STATUS
const updateTaskStatus =
  async (req, res) => {

    try {

      const { status } = req.body;

      const task =
        await Task.findByIdAndUpdate(

          req.params.id,

          { status },

          { new: true }

        );

      res.status(200).json(task);

    } catch (error) {

      res.status(500).json({
        message: error.message
      });

    }

  };


module.exports = {

  createTask,

  getTasks,

  updateTaskStatus

};
