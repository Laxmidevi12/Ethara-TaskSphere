const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,

      enum: [
        "projectlead",
        "reviewer",
        "tasker"
      ],

      default: "tasker"
    },

    jobTitle: {
      type: String
    },

    organization: {
      type: String
    },

    // LINK TO PROJECT LEAD
    projectLead: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);