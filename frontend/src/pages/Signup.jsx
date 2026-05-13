import { useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../api";

function Signup() {

  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] =
    useState("tasker");


  const [formData, setFormData] = useState({

    name: "",

    email: "",

    password: "",

    role: "tasker",

    jobTitle: "",

    organization: "",

    projectLeadEmail: ""

  });


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const selectRole = (role) => {

    setSelectedRole(role);

    setFormData({
      ...formData,
      role
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/auth/signup",
        formData
      );

      alert("Registration Successful");

      navigate("/");

    } catch (error) {

      alert(error.response.data.message);

    }

  };


  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(to right,#020617,#0f172a)",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        color: "white",

        fontFamily: "Arial"
      }}
    >

      <div
        style={{
          width: "1100px",

          background: "#0f172a",

          borderRadius: "30px",

          display: "flex",

          overflow: "hidden"
        }}
      >


        {/* LEFT */}
        <div
          style={{
            flex: 1,

            padding: "60px"
          }}
        >

          <img
            src="/logo.png"

            width="150"

            style={{
              marginBottom: "30px"
            }}
          />

          <h1
            style={{
              fontSize: "55px",

              marginBottom: "20px"
            }}
          >

            Ethara.AI

          </h1>

          <h2
            style={{
              color: "#38bdf8",

              marginBottom: "20px"
            }}
          >

            Enterprise Workforce Platform

          </h2>

        </div>


        {/* RIGHT */}
        <div
          style={{
            flex: 1,

            padding: "50px",

            background: "#111827"
          }}
        >

          <h1
            style={{
              marginBottom: "30px"
            }}
          >

            Register

          </h1>


          {/* ROLES */}
          <div
            style={{
              display: "flex",

              gap: "10px",

              marginBottom: "25px"
            }}
          >

            {
              [
                "projectlead",
                "reviewer",
                "tasker"
              ].map((role) => (

                <div
                  key={role}

                  onClick={() =>
                    selectRole(role)
                  }

                  style={{
                    flex: 1,

                    padding: "15px",

                    borderRadius: "12px",

                    background:
                      selectedRole === role
                      ? "#06b6d4"
                      : "#1e293b",

                    textAlign: "center",

                    cursor: "pointer"
                  }}
                >

                  {role}

                </div>

              ))
            }

          </div>


          <form onSubmit={handleSubmit}>

            <input
              type="text"

              name="name"

              placeholder="Full Name"

              onChange={handleChange}

              style={inputStyle}
            />


            <input
              type="text"

              name="jobTitle"

              placeholder="Job Title"

              onChange={handleChange}

              style={inputStyle}
            />


            {
              selectedRole ===
              "projectlead" && (

                <input
                  type="text"

                  name="organization"

                  placeholder="Organization Name"

                  onChange={handleChange}

                  style={inputStyle}
                />

              )
            }


            {
              selectedRole !==
              "projectlead" && (

                <input
                  type="email"

                  name="projectLeadEmail"

                  placeholder="Project Lead Email"

                  onChange={handleChange}

                  style={inputStyle}
                />

              )
            }


            <input
              type="email"

              name="email"

              placeholder="Email"

              onChange={handleChange}

              style={inputStyle}
            />


            <input
              type="password"

              name="password"

              placeholder="Password"

              onChange={handleChange}

              style={inputStyle}
            />


            <button
              style={{
                width: "100%",

                padding: "16px",

                borderRadius: "12px",

                border: "none",

                background:
                  "linear-gradient(to right,#06b6d4,#2563eb)",

                color: "white",

                fontSize: "18px",

                cursor: "pointer"
              }}
            >

              Register

            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

const inputStyle = {

  width: "100%",

  padding: "15px",

  marginBottom: "18px",

  borderRadius: "12px",

  border: "none",

  background: "#1e293b",

  color: "white"
};

export default Signup;