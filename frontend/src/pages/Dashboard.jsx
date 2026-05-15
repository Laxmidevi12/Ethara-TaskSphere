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

    if (!attendance?.active) {

      alert(
        "Please Punch In First"
      );

      return;

    }

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
              marginBottom: "12px",

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
            attendance?.punchInTime && (

              <p
                style={{
                  marginBottom: "20px",

                  color: "#38bdf8",

                  fontWeight: "bold"
                }}
              >

                Punch In Time:
                {" "}

                {
                  new Date(
                    attendance.punchInTime
                  ).toLocaleTimeString()
                }

              </p>

            )
          }

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


                <button

                  disabled={
                    !attendance?.active
                  }

                  style={{

                    ...blueBtn,

                    opacity:
                      attendance?.active
                      ? 1
                      : 0.5,

                    cursor:
                      attendance?.active
                      ? "pointer"
                      : "not-allowed"
                  }}
                >

                  {
                    attendance?.active
                    ? "Create Project"
                    : "Punch In To Create"
                  }

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
