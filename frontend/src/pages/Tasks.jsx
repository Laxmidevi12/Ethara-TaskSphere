import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import API from "../api";

function Tasks() {

  const { projectId } = useParams();

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);

  const currentRole = decoded.role;


  const [tasks, setTasks] =
    useState([]);

  const [users, setUsers] =
    useState([]);


  const [formData, setFormData] =
    useState({

      title: "",

      description: "",

      assignedTo: "",

      reviewer: "",

      dueDate: ""

    });


  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res = await API.get(
        "/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setTasks(res.data);

    } catch (error) {

      console.log(error);

    }

  };


  // FETCH TEAM MEMBERS
  const fetchUsers = async () => {

    try {

      const res = await API.get(
        "/auth/users",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUsers(res.data);

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


  // CREATE TASK
  const createTask = async (e) => {

    e.preventDefault();

    try {

      await API.post(

        "/tasks",

        {

          ...formData,

          projectId

        },

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }

      );

      fetchTasks();

    } catch (error) {

      console.log(error);

    }

  };


  // STATUS UPDATE
  const updateStatus =
    async (taskId, status) => {

      try {

        await API.put(

          `/tasks/${taskId}`,

          { status },

          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }

        );

        fetchTasks();

      } catch (error) {

        console.log(error);

      }

    };


  useEffect(() => {

    fetchTasks();

    fetchUsers();

  }, []);


  return (

    <div
      style={{
        padding: "40px",

        background: "#020617",

        minHeight: "100vh",

        color: "white"
      }}
    >

      <h1
        style={{
          marginBottom: "30px"
        }}
      >

        Project Workspace

      </h1>


      {/* PROJECT LEAD */}
      {
        currentRole ===
        "projectlead" && (

          <form
            onSubmit={createTask}

            style={{
              background: "#111827",

              padding: "30px",

              borderRadius: "20px",

              marginBottom: "35px"
            }}
          >

            <h2
              style={{
                marginBottom: "20px"
              }}
            >

              Assign Task

            </h2>


            <input
              type="text"

              name="title"

              placeholder="Task Title"

              onChange={handleChange}

              style={inputStyle}
            />


            <input
              type="text"

              name="description"

              placeholder="Description"

              onChange={handleChange}

              style={inputStyle}
            />


            {/* TASKER */}
            <select
              name="assignedTo"

              onChange={handleChange}

              style={inputStyle}
            >

              <option>

                Select Tasker

              </option>

              {
                users

                  .filter(
                    (u) =>
                      u.role === "tasker"
                  )

                  .map((user) => (

                    <option
                      key={user._id}

                      value={user._id}
                    >

                      {user.name}

                    </option>

                  ))
              }

            </select>


            {/* REVIEWER */}
            <select
              name="reviewer"

              onChange={handleChange}

              style={inputStyle}
            >

              <option>

                Select Reviewer

              </option>

              {
                users

                  .filter(
                    (u) =>
                      u.role ===
                      "reviewer"
                  )

                  .map((user) => (

                    <option
                      key={user._id}

                      value={user._id}
                    >

                      {user.name}

                    </option>

                  ))
              }

            </select>


            <input
              type="date"

              name="dueDate"

              onChange={handleChange}

              style={inputStyle}
            />


            <button style={btnStyle}>

              Assign Task

            </button>

          </form>

        )
      }


      {/* TASKS */}
      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(320px,1fr))",

          gap: "20px"
        }}
      >

        {
          tasks.map((task) => (

            <div
              key={task._id}

              style={{
                background: "#111827",

                padding: "25px",

                borderRadius: "20px"
              }}
            >

              <h2>{task.title}</h2>

              <p>{task.description}</p>

              <p>
                <strong>Project:</strong>
                {" "}
                {
                  task.project?.title
                }
              </p>

              <p>
                <strong>Status:</strong>
                {" "}
                {task.status}
              </p>


              {
                currentRole ===
                "tasker" && (

                  <>
                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "In Progress"
                        )
                      }

                      style={btnStyle}
                    >

                      Start

                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "Under Review"
                        )
                      }

                      style={btnStyle}
                    >

                      Submit

                    </button>
                  </>

                )
              }


              {
                currentRole ===
                "reviewer" && (

                  <>
                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "Completed"
                        )
                      }

                      style={btnStyle}
                    >

                      Approve

                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "Rejected"
                        )
                      }

                      style={btnStyle}
                    >

                      Reject

                    </button>
                  </>

                )
              }

            </div>

          ))
        }

      </div>

    </div>
  );
}


const inputStyle = {

  width: "100%",

  padding: "14px",

  marginBottom: "15px",

  borderRadius: "12px",

  border: "none",

  background: "#1e293b",

  color: "white"
};

const btnStyle = {

  padding: "12px 20px",

  border: "none",

  borderRadius: "12px",

  background:
    "linear-gradient(to right,#06b6d4,#2563eb)",

  color: "white",

  cursor: "pointer",

  marginRight: "10px",

  marginTop: "10px"
};

export default Tasks;
