const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


// SIGNUP
const signup = async (req, res) => {

  try {

    const {

      name,

      email,

      password,

      role,

      jobTitle,

      organization,

      projectLeadEmail

    } = req.body;


    // CHECK USER
    const userExists =
      await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({

        message:
          "User already exists"

      });

    }


    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);


    let projectLeadId = null;


    // TASKER / REVIEWER
    if (

      role === "tasker" ||

      role === "reviewer"

    ) {

      const lead =
        await User.findOne({

          email: projectLeadEmail,

          role: "projectlead"

        });


      if (!lead) {

        return res.status(404).json({

          message:
            "Project Lead not found"

        });

      }


      // SAVE LEAD ID
      projectLeadId = lead._id;

    }


    // CREATE USER
    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      role,

      jobTitle,

      organization,

      projectLead: projectLeadId

    });


    res.status(201).json({

      message:
        "Registration Successful",

      user

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};


// LOGIN
const login = async (req, res) => {

  try {

    const { email, password } =
      req.body;


    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(404).json({

        message:
          "User not found"

      });

    }


    // PASSWORD CHECK
    const isMatch =
      await bcrypt.compare(

        password,

        user.password

      );


    if (!isMatch) {

      return res.status(400).json({

        message:
          "Invalid credentials"

      });

    }


    // TOKEN
    const token = jwt.sign(

      {

        id: user._id,

        role: user.role

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "7d"

      }

    );


    res.status(200).json({

      token,

      user: {

        id: user._id,

        name: user.name,

        role: user.role,

        email: user.email

      }

    });

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};


// GET USERS
const getUsers = async (req, res) => {

  try {

    let users = [];


    // PROJECT LEAD
    if (

      req.user.role ===
      "projectlead"

    ) {

      users = await User.find({

        projectLead: req.user.id

      }).select(
        "name email role"
      );

    }


    // TASKER / REVIEWER
    else {

      const currentUser =
        await User.findById(
          req.user.id
        );


      users = await User.find({

        projectLead:
          currentUser.projectLead

      }).select(
        "name email role"
      );

    }


    res.status(200).json(users);

  } catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

};


module.exports = {

  signup,

  login,

  getUsers

};
