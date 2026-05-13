// backend/controllers/taskController.js

const Task = require("../models/Task");


// CREATE TASK
const createTask = async (
  req,
  res
) => {

  try {

    const {
      assignedTo,
      reviewer,
      projectId
    } = req.body;

    const task =
      await Task.create({

        assignedTo,
        reviewer,
        projectId,

        status: "pending",

        createdBy:
          req.user.id
      });

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// GET TASKS
const getTasks = async (
  req,
  res
) => {

  try {

    const tasks =
      await Task.find({

        projectId:
          req.params.projectId

      })

      .populate(
        "assignedTo",
        "name email"
      )

      .populate(
        "reviewer",
        "name email"
      )

      .sort({
        createdAt: -1
      });

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};


// UPDATE TASK STATUS
const updateTask = async (
  req,
  res
) => {

  try {

    const task =
      await Task.findByIdAndUpdate(

        req.params.taskId,

        {
          status:
            req.body.status
        },

        {
          new: true
        }

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
  updateTask

};
