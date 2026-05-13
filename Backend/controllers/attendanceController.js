const Attendance = require("../models/Attendance");


// PUNCH IN
const punchIn = async (req, res) => {

  try {

    const attendance = await Attendance.create({
      user: req.user.id,
      punchIn: new Date(),
      active: true
    });

    res.status(201).json(attendance);

  } catch (error) {

    res.status(500).json({
      message: error.message
      });

  }
};


// PUNCH OUT
const punchOut = async (req, res) => {

  try {

    const attendance = await Attendance.findOne({
      user: req.user.id,
      active: true
    });

    attendance.punchOut = new Date();

    attendance.active = false;

    await attendance.save();
    res.status(200).json(attendance);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};


// GET STATUS
const getAttendance = async (req, res) => {

  try {

    const attendance = await Attendance.findOne({
      user: req.user.id,
      active: true
      });

    res.status(200).json(attendance);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  punchIn,
  punchOut,
  getAttendance
};
