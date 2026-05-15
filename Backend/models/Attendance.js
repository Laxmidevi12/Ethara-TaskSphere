const mongoose =
  require("mongoose");

const attendanceSchema =
  new mongoose.Schema(

    {

      user: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User"

      },

      punchInTime: {

        type: Date

      },

      punchOutTime: {

        type: Date,

        default: null

      }

    },

    {
      timestamps: true
    }

  );

module.exports =
  mongoose.model(
    "Attendance",
    attendanceSchema
  );
