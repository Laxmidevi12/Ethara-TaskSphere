// backend/controllers/taskController.js

const Task = require("../models/Task");


// CREATE TASK
const createTask = async (
  req,
  res
) => {

  try {

    console.log(req.body);

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

    const populatedTask =
      await Task.findById(
        task._id
      )

      .populate(
        "assignedTo",
        "name email role"
      )

      .populate(
        "reviewer",
        "name email role"
      );

    res.status(201).json(
      populatedTask
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message
    });

  }

};



// GET TASKS
const getTasks = async (
  req,
  res
) => {

  try {

    let tasks = [];


    // PROJECT LEAD
    if (
      req.user.role ===
      "projectlead"
    ) {

      tasks =
        await Task.find({

          projectId:
            req.params.projectId

        });

    }


    // TASKER
    else if (
      req.user.role ===
      "tasker"
    ) {

      tasks =
        await Task.find({

          assignedTo:
            req.user.id

        });

    }


    // REVIEWER
    else if (
      req.user.role ===
      "reviewer"
    ) {

      tasks =
        await Task.find({

          reviewer:
            req.user.id

        });

    }


    // POPULATE
    tasks =
      await Task.populate(
        tasks,
        [
          {
            path:
              "assignedTo",

            select:
              "name email role"
          },

          {
            path:
              "reviewer",

            select:
              "name email role"
          }
        ]
      );


    res.status(200).json(
      tasks
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message
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

      )

      .populate(
        "assignedTo",
        "name email role"
      )

      .populate(
        "reviewer",
        "name email role"
      );


    res.status(200).json(
      task
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message:
        error.message
    });

  }

};


module.exports = {

  createTask,
  getTasks,
  updateTask

};
