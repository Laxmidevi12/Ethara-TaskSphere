const Attendance =
  require("../models/Attendance");


// PUNCH IN
const punchIn =
  async (req, res) => {

    try {

      const existing =
        await Attendance.findOne({

          user:
            req.user.id,

          punchOutTime:
            null

        });

      if (existing) {

        return res.status(400)
        .json({
          message:
            "Already punched in"
        });

      }

      const attendance =
        await Attendance.create({

          user:
            req.user.id,

          punchInTime:
            new Date()

        });

      res.status(201).json(
        attendance
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

};


// PUNCH OUT
const punchOut =
  async (req, res) => {

    try {

      const attendance =
        await Attendance.findOne({

          user:
            req.user.id,

          punchOutTime:
            null

        });

      if (!attendance) {

        return res.status(404)
        .json({
          message:
            "No active session"
        });

      }

      attendance.punchOutTime =
        new Date();

      await attendance.save();

      res.status(200).json(
        attendance
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

};


// STATUS
const getAttendanceStatus =
  async (req, res) => {

    try {

      const attendance =
        await Attendance.findOne({

          user:
            req.user.id

        })

        .sort({
          createdAt: -1
        });

      if (!attendance) {

        return res.json({

          active: false

        });

      }

      res.status(200).json({

        active:
          !attendance.punchOutTime,

        punchInTime:
          attendance.punchInTime,

        punchOutTime:
          attendance.punchOutTime

      });

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

};

module.exports = {

  punchIn,
  punchOut,
  getAttendanceStatus

};
