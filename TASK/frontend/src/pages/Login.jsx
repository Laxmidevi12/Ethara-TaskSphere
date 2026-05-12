import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api";

function Login() {

  const navigate = useNavigate();

  const [darkMode, setDarkMode] =
    useState(true);

  const [selectedRole, setSelectedRole] =
    useState("");

  const [formData, setFormData] =
    useState({
      email: "",
      password: ""
    });


  // INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  // LOGIN
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        "/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      navigate("/dashboard");

    } catch (error) {

      alert(error.response.data.message);

    }

  };


  // COLORS
  const bg = darkMode
    ? "linear-gradient(135deg,#020617,#0f172a,#111827)"
    : "linear-gradient(135deg,#dbeafe,#f8fafc,#e0f2fe)";

  const cardBg = darkMode
    ? "rgba(15,23,42,0.95)"
    : "rgba(255,255,255,0.92)";

  const text = darkMode
    ? "white"
    : "#0f172a";

  const subText = darkMode
    ? "#94a3b8"
    : "#475569";


  return (

    <div
      style={{
        minHeight: "100vh",

        background: bg,

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        fontFamily: "Arial",

        transition: "0.3s",

        padding: "30px"
      }}
    >


      {/* THEME BUTTON */}
      <button
        onClick={() =>
          setDarkMode(!darkMode)
        }

        style={{
          position: "absolute",

          top: "25px",

          right: "25px",

          padding: "12px 20px",

          borderRadius: "12px",

          border: "none",

          cursor: "pointer",

          background:
            darkMode
            ? "#1e293b"
            : "#cbd5e1",

          color:
            darkMode
            ? "white"
            : "#0f172a",

          fontWeight: "bold"
        }}
      >

        {
          darkMode
          ? "☀ Light"
          : "🌙 Dark"
        }

      </button>


      {/* MAIN CARD */}
      <div
        style={{
          width: "1100px",

          minHeight: "650px",

          display: "flex",

          borderRadius: "30px",

          overflow: "hidden",

          backdropFilter: "blur(20px)",

          background: cardBg,

          border:
            darkMode
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(0,0,0,0.08)",

          boxShadow:
            "0 10px 40px rgba(0,0,0,0.25)"
        }}
      >


        {/* LEFT */}
        <div
          style={{
            flex: 1,

            padding: "60px",

            display: "flex",

            flexDirection: "column",

            justifyContent: "center",

            alignItems: "center",

            textAlign: "center"
          }}
        >

          <img
            src="/logo.png"

            alt="logo"

            width="140"

            style={{
              marginBottom: "30px",

              borderRadius: "14px"
            }}
          />


          <h1
            style={{
              fontSize: "64px",

              color: text,

              marginBottom: "20px",

              fontWeight: "bold"
            }}
          >

            Ethara.AI

          </h1>


          <p
            style={{
              color: subText,

              fontSize: "21px",

              lineHeight: "1.9",

              maxWidth: "520px"
            }}
          >

            Manage enterprise workflows,
            assign tasks, monitor attendance,
            collaborate with teams, and
            streamline productivity efficiently.

          </p>

        </div>


        {/* RIGHT */}
        <div
          style={{
            flex: 1,

            padding: "60px",

            display: "flex",

            flexDirection: "column",

            justifyContent: "center"
          }}
        >

          <h1
            style={{
              fontSize: "58px",

              marginBottom: "35px",

              color: text,

              fontWeight: "bold",

              textAlign: "center"
            }}
          >

            Welcome Back

          </h1>


          {/* ROLE BUTTONS */}
          <div
            style={{
              display: "flex",

              gap: "12px",

              marginBottom: "35px"
            }}
          >

            {
              [
                "Project Lead",
                "Reviewer",
                "Tasker"
              ].map((role) => (

                <div
                  key={role}

                  onClick={() =>
                    setSelectedRole(role)
                  }

                  style={{
                    flex: 1,

                    padding: "16px",

                    borderRadius: "14px",

                    background:
                      selectedRole === role
                      ? "linear-gradient(to right,#06b6d4,#2563eb)"
                      : darkMode
                      ? "#1e293b"
                      : "#e2e8f0",

                    color:
                      selectedRole === role
                      ? "white"
                      : text,

                    textAlign: "center",

                    cursor: "pointer",

                    fontWeight: "bold",

                    transition: "0.3s",

                    fontSize: "18px"
                  }}
                >

                  {role}

                </div>

              ))
            }

          </div>


          {/* FORM */}
          <form onSubmit={handleSubmit}>

            <input
              type="email"

              name="email"

              placeholder="Email"

              onChange={handleChange}

              style={{
                width: "100%",

                padding: "18px",

                borderRadius: "14px",

                border: "none",

                marginBottom: "20px",

                background:
                  darkMode
                  ? "#1e293b"
                  : "#f1f5f9",

                color: text,

                fontSize: "17px"
              }}
            />


            <input
              type="password"

              name="password"

              placeholder="Password"

              onChange={handleChange}

              style={{
                width: "100%",

                padding: "18px",

                borderRadius: "14px",

                border: "none",

                marginBottom: "28px",

                background:
                  darkMode
                  ? "#1e293b"
                  : "#f1f5f9",

                color: text,

                fontSize: "17px"
              }}
            />


            <button
              style={{
                width: "100%",

                padding: "18px",

                border: "none",

                borderRadius: "14px",

                background:
                  "linear-gradient(to right,#06b6d4,#2563eb)",

                color: "white",

                fontSize: "20px",

                fontWeight: "bold",

                cursor: "pointer"
              }}
            >

              Sign In

            </button>

          </form>


          {/* REGISTER */}
          <p
            style={{
              marginTop: "28px",

              textAlign: "center",

              color: subText,

              fontSize: "17px"
            }}
          >

            Don’t have an account?

            {" "}

            <span
              onClick={() =>
                navigate("/signup")
              }

              style={{
                color: "#38bdf8",

                cursor: "pointer",

                fontWeight: "bold"
              }}
            >

              Register Here

            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;