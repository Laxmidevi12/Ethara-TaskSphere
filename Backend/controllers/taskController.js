const Task = require("../models/Task");

const User = require("../models/User");


// CREATE TASK
const createTask = async (req, res) => {

  try {

    // ONLY PROJECT LEAD
    if (req.user.role !== "projectlead") {

      return res.status(403).json({
        message:
          "Only Project Leads can create tasks"
      });

    }

    const {
      title,
      description,
      priority,
      projectId,
      assignedTo,
      reviewer
    } = req.body;


    const task = await Task.create({

      title,

      description,

      priority,

      project: projectId,

      assignedTo,

      reviewer,

      createdBy: req.user.id

    });


    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// GET TASKS BASED ON ROLE
const getTasks = async (req, res) => {

  try {

    const { projectId } = req.params;

    let tasks = [];


    // PROJECT LEAD
    if (req.user.role === "projectlead") {

      tasks = await Task.find({
        project: projectId
      })

      .populate(
        "assignedTo",
        "name email role"
      )

      .populate(
        "reviewer",
        "name email role"
      );

    }


    // TASKER
    else if (req.user.role === "tasker") {

      tasks = await Task.find({

        project: projectId,

        assignedTo: req.user.id

      })

      .populate(
        "assignedTo",
        "name email role"
      )

      .populate(
        "reviewer",
        "name email role"
      );

    }


    // REVIEWER
    else if (req.user.role === "reviewer") {

      tasks = await Task.find({

        project: projectId,

        reviewer: req.user.id

      })

      .populate(
        "assignedTo",
        "name email role"
      )

      .populate(
        "reviewer",
        "name email role"
      );

    }

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};



// TASKER STATUS UPDATE
const updateTaskStatus = async (req, res) => {

  try {

    const task = await Task.findById(
      req.params.id
    );


    if (!task) {

      return res.status(404).json({
        message: "Task not found"
      });

    }


    // TASKER CAN UPDATE OWN TASK ONLY
    if (
      req.user.role === "tasker" &&
      task.assignedTo.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can only update your own tasks"
      });

    }


    // REVIEWER CAN UPDATE REVIEW TASKS
    if (
      req.user.role === "reviewer" &&
      task.reviewer.toString() !==
      req.user.id
    ) {

      return res.status(403).json({
        message:
          "You can only review assigned tasks"
      });

    }


    task.status = req.body.status;

    await task.save();

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