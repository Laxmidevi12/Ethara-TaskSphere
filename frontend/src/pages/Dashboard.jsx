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

};  will this code show team members in dropdown for PL 


Pasted code.js
JavaScript
 do i need to update this

i assigned to dhoni but still not visible

i created project in projectlead dashbaord but it is not showing and if it is not showing how can i assign task

i created project but n use it is not showing


Pasted text(52).txt
Document

You only need to update 2 files.

1. UPDATE LOGIN FILE
File:

frontend/src/pages/Login.jsx
Find this:

localStorage.setItem(
  "token",
  res.data.token
);
ADD BELOW IT:

localStorage.setItem(
  "user",
  JSON.stringify(
    res.data.user
  )
);
2. UPDATE DASHBOARD FILE
File:

frontend/src/pages/Dashboard.jsx
ADD THIS
Find:

const currentRole =
  decoded.role;
ADD BELOW IT:

const user =
  JSON.parse(
    localStorage.getItem("user")
  );
ADD USER DETAILS UI
Find:

<h1
  style={{
    color: "#38bdf8",
which shows:

Ethara.AI
ADD THIS BELOW IT:

<div
  style={{
    background:
      darkMode
      ? "#111827"
      : "#cbd5e1",

    padding: "18px",

    borderRadius: "16px",

    marginBottom: "30px"
  }}
>

  <h3
    style={{
      color: "#38bdf8",
      marginBottom: "10px"
    }}
  >

    User Details

  </h3>

  <p>
    <strong>Name:</strong>
    {" "}
    {user?.name}
  </p>

  <p>
    <strong>Email:</strong>
    {" "}
    {user?.email}
  </p>

  <p>
    <strong>Role:</strong>
    {" "}

    <span
      style={{
        textTransform:
          "capitalize"
      }}
    >
      {user?.role}
    </span>

  </p>

</div>
UPDATE LOGOUT
Find:

localStorage.removeItem("token");
ADD BELOW IT:

localStorage.removeItem("user");
AFTER THAT
Run:

git add .
git commit -m "added user profile section"
git push
Then Railway redeploys automatically.

After login:

user details appear in sidebar/dashboard.



Pasted text(53).txt
Document
 PLS UPDATE AND GIVE

Update your Dashboard.jsx with these exact changes. 


1. ADD USER VARIABLE
Find:

const currentRole = decoded.role;
Replace with:

const currentRole = decoded.role;

const user =
  JSON.parse(
    localStorage.getItem("user")
  );
2. UPDATE LOGOUT FUNCTION
Find:

const logout = () => {

  localStorage.removeItem("token");

  navigate("/");

};
Replace with:

const logout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  navigate("/");

};
3. ADD USER DETAILS CARD
Find this section:

<h1
  style={{
    color: "#38bdf8",

    marginBottom: "40px"
  }}
>

  Ethara.AI

</h1>
ADD THIS IMMEDIATELY BELOW IT:

<div
  style={{
    background:
      darkMode
      ? "#111827"
      : "#cbd5e1",

    padding: "18px",

    borderRadius: "16px",

    marginBottom: "30px"
  }}
>

  <h3
    style={{
      color: "#38bdf8",

      marginBottom: "12px"
    }}
  >

    User Details

  </h3>

  <p
    style={{
      marginBottom: "8px"
    }}
  >

    <strong>Name:</strong>
    {" "}
    {user?.name}

  </p>

  <p
    style={{
      marginBottom: "8px"
    }}
  >

    <strong>Email:</strong>
    {" "}
    {user?.email}

  </p>

  <p>

    <strong>Role:</strong>
    {" "}

    <span
      style={{
        textTransform:
          "capitalize",

        color: "#38bdf8"
      }}
    >

      {user?.role}

    </span>

  </p>

</div>
4. UPDATE LOGIN.JSX
Open:

frontend/src/pages/Login.jsx
Find:

localStorage.setItem(
  "token",
  res.data.token
);
ADD BELOW IT:

localStorage.setItem(
  "user",
  JSON.stringify(
    res.data.user
  )
);
FINAL STEP
Run:

git add .
git commit -m "added user details section"
git push
Then login again.

You will now see:

Name

Email

Role

inside the dashboard sidebar.


// ADD THIS BELOW:
const currentRole = decoded.role;

const user =
  JSON.parse(
    localStorage.getItem("user")
  );
// REPLACE LOGOUT FUNCTION WITH THIS

const logout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("user");

  navigate("/");

};
// ADD THIS BELOW ETHARA.AI HEADING

<div
  style={{
    background:
      darkMode
      ? "#111827"
      : "#cbd5e1",

    padding: "18px",

    borderRadius: "16px",

    marginBottom: "30px"
  }}
>

  <h3
    style={{
      color: "#38bdf8",

      marginBottom: "12px"
    }}
  >

    User Details

  </h3>

  <p
    style={{
      marginBottom: "8px"
    }}
  >

    <strong>Name:</strong>
    {" "}
    {user?.name}

  </p>

  <p
    style={{
      marginBottom: "8px"
    }}
  >

    <strong>Email:</strong>
    {" "}
    {user?.email}

  </p>

  <p>

    <strong>Role:</strong>
    {" "}

    <span
      style={{
        textTransform:
          "capitalize",

        color: "#38bdf8"
      }}
    >

      {user?.role}

    </span>

  </p>

</div>
// LOGIN.JSX

// FIND THIS:
localStorage.setItem(
  "token",
  res.data.token
);

// ADD THIS BELOW IT:
localStorage.setItem(
  "user",
  JSON.stringify(
    res.data.user
  )
);
FILES TO UPDATE
frontend/src/pages/Dashboard.jsx
frontend/src/pages/Login.jsx
AFTER UPDATE
git add .
git commit -m "added user details section"
git push
Then:

logout

login again

User details will appear in sidebar.


NO GIVE FULL UPDATED CODE OF DASHBOARD import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import API from "../api";

function Dashboard() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);

  const currentRole = decoded.role;


  const [projects, setProjects] =
    useState([]);

  const [attendance, setAttendance] =
    useState(null);

  const [darkMode, setDarkMode] =
    useState(true);


  const [formData, setFormData] =
    useState({
      title: "",
      description: ""
    });


  // FETCH PROJECTS
  const fetchProjects = async () => {

    try {

      const res = await API.get(
        "/projects",
        {
          headers: {
            Authorization: Bearer ${token}
          }
        }
      );

      setProjects(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  // ATTENDANCE
  const getAttendanceStatus = async () => {

    try {

      const res = await API.get(
        "/attendance/status",
        {
          headers: {
            Authorization: Bearer ${token}
          }
        }
      );

      setAttendance(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  // PUNCH IN
  const punchIn = async () => {

    try {

      await API.post(
        "/attendance/punchin",
        {},
        {
          headers: {
            Authorization: Bearer ${token}
          }
        }
      );

      getAttendanceStatus();

    } catch (error) {

      console.log(error);

    }

  };


  // PUNCH OUT
  const punchOut = async () => {

    try {

      await API.post(
        "/attendance/punchout",
        {},
        {
          headers: {
            Authorization: Bearer ${token}
          }
        }
      );

      setAttendance(null);

    } catch (error) {

      console.log(error);

    }

  };


  // INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // CREATE PROJECT
  const createProject = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/projects",
        formData,
        {
          headers: {
            Authorization: Bearer ${token}
          }
        }
      );

      fetchProjects();

      setFormData({
        title: "",
        description: ""
      });

    } catch (error) {

      console.log(error);

    }

  };


  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    navigate("/");

  };


  useEffect(() => {

    fetchProjects();

    getAttendanceStatus();

  }, []);


  // COLORS
  const bg = darkMode
    ? "#020617"
    : "#f1f5f9";

  const card = darkMode
    ? "#111827"
    : "white";

  const text = darkMode
    ? "white"
    : "#0f172a";

  const subText = darkMode
    ? "#94a3b8"
    : "#475569";


  return (

    <div
      style={{
        display: "flex",

        minHeight: "100vh",

        background: bg,

        color: text,

        fontFamily: "Arial",

        transition: "0.3s"
      }}
    >


      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",

          background:
            darkMode
            ? "#0f172a"
            : "#e2e8f0",

          padding: "30px",

          borderRight:
            darkMode
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid rgba(0,0,0,0.05)"
        }}
      >

        <img
          src="/logo.png"

          width="120"

          style={{
            marginBottom: "20px"
          }}
        />

        <h1
          style={{
            color: "#38bdf8",

            marginBottom: "40px"
          }}
        >

          Ethara.AI

        </h1>


        {/* NAV */}
        {
          [
            "Dashboard",
            "Projects",
            "Tasks",
            "Attendance",
            "Reviews"
          ].map((item) => (

            <div
              key={item}

              style={{
                padding: "14px",

                marginBottom: "12px",

                borderRadius: "12px",

                cursor: "pointer",

                background:
                  item === "Dashboard"
                  ? "linear-gradient(to right,#06b6d4,#2563eb)"
                  : "transparent"
              }}
            >

              {item}

            </div>

          ))
        }


        {/* THEME */}
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }

          style={{
            marginTop: "40px",

            width: "100%",

            padding: "14px",

            borderRadius: "12px",

            border: "none",

            cursor: "pointer",

            background:
              darkMode
              ? "#1e293b"
              : "#cbd5e1",

            color: text
          }}
        >

          {
            darkMode
            ? "☀ Light Mode"
            : "🌙 Dark Mode"
          }

        </button>


        {/* LOGOUT */}
        <button
          onClick={logout}

          style={{
            marginTop: "15px",

            width: "100%",

            padding: "14px",

            borderRadius: "12px",

            border: "none",

            cursor: "pointer",

            background:
              "linear-gradient(to right,#ef4444,#dc2626)",

            color: "white"
          }}
        >

          Logout

        </button>

      </div>


      {/* MAIN */}
      <div
        style={{
          flex: 1,

          padding: "35px"
        }}
      >

        {/* HEADER */}
        <div
          style={{
            marginBottom: "35px"
          }}
        >

          <h1
            style={{
              fontSize: "42px",

              marginBottom: "10px"
            }}
          >

            Welcome Back

          </h1>

          <p
            style={{
              color: subText,

              fontSize: "18px"
            }}
          >

            Logged in as:
            {" "}

            <span
              style={{
                color: "#38bdf8",

                textTransform: "capitalize"
              }}
            >

              {currentRole}

            </span>

          </p>

        </div>


        {/* ANALYTICS */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",

            gap: "20px",

            marginBottom: "35px"
          }}
        >

          {/* CARD */}
          <div
            style={{
              background: card,

              padding: "30px",

              borderRadius: "22px",

              transition: "0.3s",

              cursor: "pointer"
            }}
          >

            <h3
              style={{
                marginBottom: "15px"
              }}
            >

              Total Projects

            </h3>

            <h1
              style={{
                fontSize: "55px",

                color: "#38bdf8"
              }}
            >

              {projects.length}

            </h1>

          </div>


          {/* ROLE */}
          <div
            style={{
              background: card,

              padding: "30px",

              borderRadius: "22px"
            }}
          >

            <h3
              style={{
                marginBottom: "15px"
              }}
            >

              Active Role

            </h3>

            <h1
              style={{
                textTransform: "capitalize",

                color: "#8b5cf6"
              }}
            >

              {currentRole}

            </h1>

          </div>

        </div>


        {/* ATTENDANCE */}
        <div
          style={{
            background: card,

            padding: "30px",

            borderRadius: "22px",

            marginBottom: "35px"
          }}
        >

          <h2
            style={{
              marginBottom: "15px"
            }}
          >

            Work Session

          </h2>

          <p
            style={{
              marginBottom: "20px",

              color: subText
            }}
          >

            {
              attendance?.active
              ? "Currently punched in"
              : "Start your work session"
            }

          </p>

          {
            attendance?.active ? (

              <button
                onClick={punchOut}

                style={redBtn}
              >

                Punch Out

              </button>

            ) : (

              <button
                onClick={punchIn}

                style={greenBtn}
              >

                Punch In

              </button>

            )
          }

        </div>


        {/* PROJECT LEAD */}
        {
          currentRole ===
          "projectlead" && (

            <div
              style={{
                background: card,

                padding: "30px",

                borderRadius: "22px",

                marginBottom: "35px"
              }}
            >

              <h2
                style={{
                  marginBottom: "20px"
                }}
              >

                Create Project

              </h2>

              <form onSubmit={createProject}>

                <input
                  type="text"

                  name="title"

                  placeholder="Project Title"

                  value={formData.title}

                  onChange={handleChange}

                  style={inputStyle(
                    darkMode
                  )}
                />


                <input
                  type="text"

                  name="description"

                  placeholder="Description"

                  value={
                    formData.description
                  }

                  onChange={handleChange}

                  style={inputStyle(
                    darkMode
                  )}
                />


                <button style={blueBtn}>

                  Create Project

                </button>

              </form>

            </div>

          )
        }


        {/* PROJECTS */}
        <div>

          <h2
            style={{
              marginBottom: "20px"
            }}
          >

            Projects Workspace

          </h2>


          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(320px,1fr))",

              gap: "20px"
            }}
          >

            {
              projects.map((project) => (

                <div
                  key={project._id}

                  style={{
                    background: card,

                    padding: "25px",

                    borderRadius: "22px"
                  }}
                >

                  <h2
                    style={{
                      marginBottom: "12px"
                    }}
                  >

                    {project.title}

                  </h2>

                  <p
                    style={{
                      color: subText,

                      marginBottom: "20px"
                    }}
                  >

                    {
                      project.description
                    }

                  </p>


                  <button
                    onClick={() =>
                      navigate(
                        /tasks/${project._id}
                      )
                    }

                    style={blueBtn}
                  >

                    Open Workspace

                  </button>

                </div>

              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}


// BUTTONS
const blueBtn = {

  padding: "14px 24px",

  border: "none",

  borderRadius: "12px",

  background:
    "linear-gradient(to right,#06b6d4,#2563eb)",

  color: "white",

  cursor: "pointer",

  fontWeight: "bold"
};

const redBtn = {

  padding: "14px 24px",

  border: "none",

  borderRadius: "12px",

  background:
    "linear-gradient(to right,#ef4444,#dc2626)",

  color: "white",

  cursor: "pointer",

  fontWeight: "bold"
};

const greenBtn = {

  padding: "14px 24px",

  border: "none",

  borderRadius: "12px",

  background:
    "linear-gradient(to right,#10b981,#059669)",

  color: "white",

  cursor: "pointer",

  fontWeight: "bold"
};


// INPUT
const inputStyle = (darkMode) => ({

  width: "100%",

  padding: "15px",

  marginBottom: "18px",

  borderRadius: "12px",

  border: "none",

  background:
    darkMode
    ? "#1e293b"
    : "#e2e8f0",

  color:
    darkMode
    ? "white"
    : "#0f172a"
});

export default Dashboard;

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import API from "../api";

function Dashboard() {

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);

  const currentRole = decoded.role;

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );


  const [projects, setProjects] =
    useState([]);

  const [attendance, setAttendance] =
    useState(null);

  const [darkMode, setDarkMode] =
    useState(true);


  const [formData, setFormData] =
    useState({
      title: "",
      description: ""
    });


  // FETCH PROJECTS
  const fetchProjects = async () => {

    try {

      const res = await API.get(
        "/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setProjects(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  // ATTENDANCE
  const getAttendanceStatus = async () => {

    try {

      const res = await API.get(
        "/attendance/status",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAttendance(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  // PUNCH IN
  const punchIn = async () => {

    try {

      await API.post(
        "/attendance/punchin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      getAttendanceStatus();

    } catch (error) {

      console.log(error);

    }

  };


  // PUNCH OUT
  const punchOut = async () => {

    try {

      await API.post(
        "/attendance/punchout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setAttendance(null);

    } catch (error) {

      console.log(error);

    }

  };


  // INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // CREATE PROJECT
  const createProject = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/projects",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchProjects();

      setFormData({
        title: "",
        description: ""
      });

    } catch (error) {

      console.log(error);

    }

  };


  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/");

  };


  useEffect(() => {

    fetchProjects();

    getAttendanceStatus();

  }, []);


  // COLORS
  const bg = darkMode
    ? "#020617"
    : "#f1f5f9";

  const card = darkMode
    ? "#111827"
    : "white";

  const text = darkMode
    ? "white"
    : "#0f172a";

  const subText = darkMode
    ? "#94a3b8"
    : "#475569";


  return (

    <div
      style={{
        display: "flex",

        minHeight: "100vh",

        background: bg,

        color: text,

        fontFamily: "Arial",

        transition: "0.3s"
      }}
    >


      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",

          background:
            darkMode
            ? "#0f172a"
            : "#e2e8f0",

          padding: "30px",

          borderRight:
            darkMode
            ? "1px solid rgba(255,255,255,0.05)"
            : "1px solid rgba(0,0,0,0.05)"
        }}
      >

        <img
          src="/logo.png"

          width="120"

          style={{
            marginBottom: "20px"
          }}
        />

        <h1
          style={{
            color: "#38bdf8",

            marginBottom: "25px"
          }}
        >

          Ethara.AI

        </h1>


        {/* USER DETAILS */}
        <div
          style={{
            background:
              darkMode
              ? "#111827"
              : "#cbd5e1",

            padding: "18px",

            borderRadius: "16px",

            marginBottom: "30px"
          }}
        >

          <h3
            style={{
              color: "#38bdf8",

              marginBottom: "12px"
            }}
          >

            User Details

          </h3>

          <p
            style={{
              marginBottom: "8px"
            }}
          >

            <strong>Name:</strong>
            {" "}
            {user?.name}

          </p>

          <p
            style={{
              marginBottom: "8px"
            }}
          >

            <strong>Email:</strong>
            {" "}
            {user?.email}

          </p>

          <p>

            <strong>Role:</strong>
            {" "}

            <span
              style={{
                textTransform:
                  "capitalize",

                color: "#38bdf8"
              }}
            >

              {user?.role}

            </span>

          </p>

        </div>


        {/* NAV */}
        {
          [
            "Dashboard",
            "Projects",
            "Tasks",
            "Attendance",
            "Reviews"
          ].map((item) => (

            <div
              key={item}

              style={{
                padding: "14px",

                marginBottom: "12px",

                borderRadius: "12px",

                cursor: "pointer",

                background:
                  item === "Dashboard"
                  ? "linear-gradient(to right,#06b6d4,#2563eb)"
                  : "transparent"
              }}
            >

              {item}

            </div>

          ))
        }


        {/* THEME */}
        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }

          style={{
            marginTop: "40px",

            width: "100%",

            padding: "14px",

            borderRadius: "12px",

            border: "none",

            cursor: "pointer",

            background:
              darkMode
              ? "#1e293b"
              : "#cbd5e1",

            color: text
          }}
        >

          {
            darkMode
            ? "☀ Light Mode"
            : "🌙 Dark Mode"
          }

        </button>


        {/* LOGOUT */}
        <button
          onClick={logout}

          style={{
            marginTop: "15px",

            width: "100%",

            padding: "14px",

            borderRadius: "12px",

            border: "none",

            cursor: "pointer",

            background:
              "linear-gradient(to right,#ef4444,#dc2626)",

            color: "white"
          }}
        >

          Logout

        </button>

      </div>


      {/* MAIN */}
      <div
        style={{
          flex: 1,

          padding: "35px"
        }}
      >

        {/* HEADER */}
        <div
          style={{
            marginBottom: "35px"
          }}
        >

          <h1
            style={{
              fontSize: "42px",

              marginBottom: "10px"
            }}
          >

            Welcome Back

          </h1>

          <p
            style={{
              color: subText,

              fontSize: "18px"
            }}
          >

            Logged in as:
            {" "}

            <span
              style={{
                color: "#38bdf8",

                textTransform: "capitalize"
              }}
            >

              {currentRole}

            </span>

          </p>

        </div>


        {/* ANALYTICS */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",

            gap: "20px",

            marginBottom: "35px"
          }}
        >

          {/* CARD */}
          <div
            style={{
              background: card,

              padding: "30px",

              borderRadius: "22px",

              transition: "0.3s",

              cursor: "pointer"
            }}
          >

            <h3
              style={{
                marginBottom: "15px"
              }}
            >

              Total Projects

            </h3>

            <h1
              style={{
                fontSize: "55px",

                color: "#38bdf8"
              }}
            >

              {projects.length}

            </h1>

          </div>


          {/* ROLE */}
          <div
            style={{
              background: card,

              padding: "30px",

              borderRadius: "22px"
            }}
          >

            <h3
              style={{
                marginBottom: "15px"
              }}
            >

              Active Role

            </h3>

            <h1
              style={{
                textTransform: "capitalize",

                color: "#8b5cf6"
              }}
            >

              {currentRole}

            </h1>

          </div>

        </div>


        {/* ATTENDANCE */}
        <div
          style={{
            background: card,

            padding: "30px",

            borderRadius: "22px",

            marginBottom: "35px"
          }}
        >

          <h2
            style={{
              marginBottom: "15px"
            }}
          >

            Work Session

          </h2>

          <p
            style={{
              marginBottom: "20px",

              color: subText
            }}
          >

            {
              attendance?.active
              ? "Currently punched in"
              : "Start your work session"
            }

          </p>

          {
            attendance?.active ? (

              <button
                onClick={punchOut}

                style={redBtn}
              >

                Punch Out

              </button>

            ) : (

              <button
                onClick={punchIn}

                style={greenBtn}
              >

                Punch In

              </button>

            )
          }

        </div>


        {/* PROJECT LEAD */}
        {
          currentRole ===
          "projectlead" && (

            <div
              style={{
                background: card,

                padding: "30px",

                borderRadius: "22px",

                marginBottom: "35px"
              }}
            >

              <h2
                style={{
                  marginBottom: "20px"
                }}
              >

                Create Project

              </h2>

              <form onSubmit={createProject}>

                <input
                  type="text"

                  name="title"

                  placeholder="Project Title"

                  value={formData.title}

                  onChange={handleChange}

                  style={inputStyle(
                    darkMode
                  )}
                />


                <input
                  type="text"

                  name="description"

                  placeholder="Description"

                  value={
                    formData.description
                  }

                  onChange={handleChange}

                  style={inputStyle(
                    darkMode
                  )}
                />


                <button style={blueBtn}>

                  Create Project

                </button>

              </form>

            </div>

          )
        }


        {/* PROJECTS */}
        <div>

          <h2
            style={{
              marginBottom: "20px"
            }}
          >

            Projects Workspace

          </h2>


          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit,minmax(320px,1fr))",

              gap: "20px"
            }}
          >

            {
              projects.map((project) => (

                <div
                  key={project._id}

                  style={{
                    background: card,

                    padding: "25px",

                    borderRadius: "22px"
                  }}
                >

                  <h2
                    style={{
                      marginBottom: "12px"
                    }}
                  >

                    {project.title}

                  </h2>

                  <p
                    style={{
                      color: subText,

                      marginBottom: "20px"
                    }}
                  >

                    {
                      project.description
                    }

                  </p>


                  <button
                    onClick={() =>
                      navigate(
                        `/tasks/${project._id}`
                      )
                    }

                    style={blueBtn}
                  >

                    Open Workspace

                  </button>

                </div>

              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}


// BUTTONS
const blueBtn = {

  padding: "14px 24px",

  border: "none",

  borderRadius: "12px",

  background:
    "linear-gradient(to right,#06b6d4,#2563eb)",

  color: "white",

  cursor: "pointer",

  fontWeight: "bold"
};

const redBtn = {

  padding: "14px 24px",

  border: "none",

  borderRadius: "12px",

  background:
    "linear-gradient(to right,#ef4444,#dc2626)",

  color: "white",

  cursor: "pointer",

  fontWeight: "bold"
};

const greenBtn = {

  padding: "14px 24px",

  border: "none",

  borderRadius: "12px",

  background:
    "linear-gradient(to right,#10b981,#059669)",

  color: "white",

  cursor: "pointer",

  fontWeight: "bold"
};


// INPUT
const inputStyle = (darkMode) => ({

  width: "100%",

  padding: "15px",

  marginBottom: "18px",

  borderRadius: "12px",

  border: "none",

  background:
    darkMode
    ? "#1e293b"
    : "#e2e8f0",

  color:
    darkMode
    ? "white"
    : "#0f172a"
});

export default Dashboard;

image(964).png
 IT IS LIKE THIS I DONT WANT LIKE THIS

The values are empty because user is not stored in localStorage during login.

Instead of showing empty fields, use JWT decoded values directly.

Replace this section in Dashboard.jsx:

const user =
  JSON.parse(
    localStorage.getItem("user")
  );
WITH:

const user = {

  name:
    decoded.name || "User",

  email:
    decoded.email || "No Email",

  role:
    decoded.role

};
NOW update your login token payload also.

Open:

backend/controllers/authController.js
Find:

const token = jwt.sign(
Replace token payload with this:

const token = jwt.sign(

  {
    id: user._id,

    name: user.name,

    email: user.email,

    role: user.role
  },

  process.env.JWT_SECRET,

  {
    expiresIn: "7d"
  }

);
Then:

git add .
git commit -m "added user info in jwt"
git push
AFTER REDEPLOY:

logout

login again

Now sidebar will correctly show:

Name

Email

Role

instead of empty values.


import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import API from "../api";

function Dashboard() {

const navigate = useNavigate();

const token = localStorage.getItem("token");

const decoded = jwtDecode(token);

const currentRole = decoded.role;

const [projects, setProjects] =
useState([]);

const [attendance, setAttendance] =
useState(null);

const [darkMode, setDarkMode] =
useState(true);

const [formData, setFormData] =
useState({
title: "",
description: ""
});

// FETCH PROJECTS
const fetchProjects = async () => {

try {

  const res = await API.get(
    "/projects",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setProjects(res.data);

} catch (error) {

  console.log(error);

}
};

// ATTENDANCE
const getAttendanceStatus = async () => {

try {

  const res = await API.get(
    "/attendance/status",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setAttendance(res.data);

} catch (error) {

  console.log(error);

}
};

// PUNCH IN
const punchIn = async () => {

try {

  await API.post(
    "/attendance/punchin",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  getAttendanceStatus();

} catch (error) {

  console.log(error);

}
};

// PUNCH OUT
const punchOut = async () => {

try {

  await API.post(
    "/attendance/punchout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  setAttendance(null);

} catch (error) {

  console.log(error);

}
};

// INPUT
const handleChange = (e) => {

setFormData({
  ...formData,
  [e.target.name]: e.target.value
});
};

// CREATE PROJECT
const createProject = async (e) => {

e.preventDefault();

try {

  await API.post(
    "/projects",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  fetchProjects();

  setFormData({
    title: "",
    description: ""
  });

} catch (error) {

  console.log(error);

}
};

// LOGOUT
const logout = () => {

localStorage.removeItem("token");

navigate("/");
};

useEffect(() => {

fetchProjects();

getAttendanceStatus();
}, []);

// COLORS
const bg = darkMode
? "#020617"
: "#f1f5f9";

const card = darkMode
? "#111827"
: "white";

const text = darkMode
? "white"
: "#0f172a";

const subText = darkMode
? "#94a3b8"
: "#475569";

return (

<div
  style={{
    display: "flex",

    minHeight: "100vh",

    background: bg,

    color: text,

    fontFamily: "Arial",

    transition: "0.3s"
  }}
>


  {/* SIDEBAR */}
  <div
    style={{
      width: "260px",

      background:
        darkMode
        ? "#0f172a"
        : "#e2e8f0",

      padding: "30px",

      borderRight:
        darkMode
        ? "1px solid rgba(255,255,255,0.05)"
        : "1px solid rgba(0,0,0,0.05)"
    }}
  >

    <img
      src="/logo.png"

      width="120"

      style={{
        marginBottom: "20px"
      }}
    />

    <h1
      style={{
        color: "#38bdf8",

        marginBottom: "40px"
      }}
    >

      Ethara.AI

    </h1>


    {/* NAV */}
    {
      [
        "Dashboard",
        "Projects",
        "Tasks",
        "Attendance",
        "Reviews"
      ].map((item) => (

        <div
          key={item}

          style={{
            padding: "14px",

            marginBottom: "12px",

            borderRadius: "12px",

            cursor: "pointer",

            background:
              item === "Dashboard"
              ? "linear-gradient(to right,#06b6d4,#2563eb)"
              : "transparent"
          }}
        >

          {item}

        </div>

      ))
    }


    {/* THEME */}
    <button
      onClick={() =>
        setDarkMode(!darkMode)
      }

      style={{
        marginTop: "40px",

        width: "100%",

        padding: "14px",

        borderRadius: "12px",

        border: "none",

        cursor: "pointer",

        background:
          darkMode
          ? "#1e293b"
          : "#cbd5e1",

        color: text
      }}
    >

      {
        darkMode
        ? "☀ Light Mode"
        : "🌙 Dark Mode"
      }

    </button>


    {/* LOGOUT */}
    <button
      onClick={logout}

      style={{
        marginTop: "15px",

        width: "100%",

        padding: "14px",

        borderRadius: "12px",

        border: "none",

        cursor: "pointer",

        background:
          "linear-gradient(to right,#ef4444,#dc2626)",

        color: "white"
      }}
    >

      Logout

    </button>

  </div>


  {/* MAIN */}
  <div
    style={{
      flex: 1,

      padding: "35px"
    }}
  >

    {/* HEADER */}
    <div
      style={{
        marginBottom: "35px"
      }}
    >

      <h1
        style={{
          fontSize: "42px",

          marginBottom: "10px"
        }}
      >

        Welcome Back

      </h1>

      <p
        style={{
          color: subText,

          fontSize: "18px"
        }}
      >

        Logged in as:
        {" "}

        <span
          style={{
            color: "#38bdf8",

            textTransform: "capitalize"
          }}
        >

          {currentRole}

        </span>

      </p>

    </div>


    {/* ANALYTICS */}
    <div
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(260px,1fr))",

        gap: "20px",

        marginBottom: "35px"
      }}
    >

      {/* CARD */}
      <div
        style={{
          background: card,

          padding: "30px",

          borderRadius: "22px",

          transition: "0.3s",

          cursor: "pointer"
        }}
      >

        <h3
          style={{
            marginBottom: "15px"
          }}
        >

          Total Projects

        </h3>

        <h1
          style={{
            fontSize: "55px",

            color: "#38bdf8"
          }}
        >

          {projects.length}

        </h1>

      </div>


      {/* ROLE */}
      <div
        style={{
          background: card,

          padding: "30px",

          borderRadius: "22px"
        }}
      >

        <h3
          style={{
            marginBottom: "15px"
          }}
        >

          Active Role

        </h3>

        <h1
          style={{
            textTransform: "capitalize",

            color: "#8b5cf6"
          }}
        >

          {currentRole}

        </h1>

      </div>

    </div>


    {/* ATTENDANCE */}
    <div
      style={{
        background: card,

        padding: "30px",

        borderRadius: "22px",

        marginBottom: "35px"
      }}
    >

      <h2
        style={{
          marginBottom: "15px"
        }}
      >

        Work Session

      </h2>

      <p
        style={{
          marginBottom: "20px",

          color: subText
        }}
      >

        {
          attendance?.active
          ? "Currently punched in"
          : "Start your work session"
        }

      </p>

      {
        attendance?.active ? (

          <button
            onClick={punchOut}

            style={redBtn}
          >

            Punch Out

          </button>

        ) : (

          <button
            onClick={punchIn}

            style={greenBtn}
          >

            Punch In

          </button>

        )
      }

    </div>


    {/* PROJECT LEAD */}
    {
      currentRole ===
      "projectlead" && (

        <div
          style={{
            background: card,

            padding: "30px",

            borderRadius: "22px",

            marginBottom: "35px"
          }}
        >

          <h2
            style={{
              marginBottom: "20px"
            }}
          >

            Create Project

          </h2>

          <form onSubmit={createProject}>

            <input
              type="text"

              name="title"

              placeholder="Project Title"

              value={formData.title}

              onChange={handleChange}

              style={inputStyle(
                darkMode
              )}
            />


            <input
              type="text"

              name="description"

              placeholder="Description"

              value={
                formData.description
              }

              onChange={handleChange}

              style={inputStyle(
                darkMode
              )}
            />


            <button style={blueBtn}>

              Create Project

            </button>

          </form>

        </div>

      )
    }


    {/* PROJECTS */}
    <div>

      <h2
        style={{
          marginBottom: "20px"
        }}
      >

        Projects Workspace

      </h2>


      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",

          gap: "20px"
        }}
      >

        {
          projects.map((project) => (

            <div
              key={project._id}

              style={{
                background: card,

                padding: "25px",

                borderRadius: "22px"
              }}
            >

              <h2
                style={{
                  marginBottom: "12px"
                }}
              >

                {project.title}

              </h2>

              <p
                style={{
                  color: subText,

                  marginBottom: "20px"
                }}
              >

                {
                  project.description
                }

              </p>


              <button
                onClick={() =>
                  navigate(
                    `/tasks/${project._id}`
                  )
                }

                style={blueBtn}
              >

                Open Workspace

              </button>

            </div>

          ))
        }

      </div>

    </div>

  </div>

</div>
);
}

// BUTTONS
const blueBtn = {

padding: "14px 24px",

border: "none",

borderRadius: "12px",

background:
"linear-gradient(to right,#06b6d4,#2563eb)",

color: "white",

cursor: "pointer",

fontWeight: "bold"
};

const redBtn = {

padding: "14px 24px",

border: "none",

borderRadius: "12px",

background:
"linear-gradient(to right,#ef4444,#dc2626)",

color: "white",

cursor: "pointer",

fontWeight: "bold"
};

const greenBtn = {

padding: "14px 24px",

border: "none",

borderRadius: "12px",

background:
"linear-gradient(to right,#10b981,#059669)",

color: "white",

cursor: "pointer",

fontWeight: "bold"
};

// INPUT
const inputStyle = (darkMode) => ({

width: "100%",

padding: "15px",

marginBottom: "18px",

borderRadius: "12px",

border: "none",

background:
darkMode
? "#1e293b"
: "#e2e8f0",

color:
darkMode
? "white"
: "#0f172a"
});

export default Dashboard;



