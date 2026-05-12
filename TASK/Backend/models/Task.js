const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    priority: {
      type: String,

      enum: [
        "low",
        "medium",
        "high"
      ],

      default: "medium"
    },

    status: {
      type: String,

      enum: [
        "todo",
        "in-progress",
        "review",
        "approved"
      ],

      default: "todo"
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Project",

      required: true
    },

    // TASKER
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true
    },

    // REVIEWER
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true
    },

    // PROJECT LEAD
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Task",
  taskSchema
);