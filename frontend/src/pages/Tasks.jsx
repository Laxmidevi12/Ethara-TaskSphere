import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API from "../api";

import { jwtDecode } from "jwt-decode";

function Tasks() {

  const { projectId } = useParams();

  const token = localStorage.getItem("token");

  const decoded = jwtDecode(token);

  const currentRole = decoded.role;


  const [tasks, setTasks] = useState([]);

  const [users, setUsers] = useState([]);


  const [formData, setFormData] = useState({

    title: "",

    description: "",

    priority: "medium",

    assignedTo: "",

    reviewer: ""

  });


  // FETCH USERS
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


  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res = await API.get(
        `/tasks/${projectId}`,
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


  // HANDLE INPUT
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

      alert("Task Assigned");

      fetchTasks();

    } catch (error) {

      console.log(error);

    }

  };


  // UPDATE STATUS
  const updateStatus = async (
    taskId,
    status
  ) => {

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
        background: "#020617",

        minHeight: "100vh",

        color: "white",

        padding: "40px",

        fontFamily: "Arial"
      }}
    >

      <h1
        style={{
          marginBottom: "30px"
        }}
      >

        Enterprise Workflow Board

      </h1>


      {/* PROJECT LEAD ONLY */}
      {
        currentRole === "projectlead" && (

          <div
            style={{
              background: "#1e293b",

              padding: "25px",

              borderRadius: "16px",

              marginBottom: "30px"
            }}
          >

            <h2
              style={{
                marginBottom: "20px"
              }}
            >

              Assign Task

            </h2>


            <form onSubmit={createTask}>

              <input
                type="text"

                name="title"

                placeholder="Task Title"

                onChange={handleChange}

                style={{
                  width: "100%",

                  padding: "14px",

                  borderRadius: "10px",

                  marginBottom: "15px",

                  border: "none",

                  background: "#334155",

                  color: "white"
                }}
              />


              <input
                type="text"

                name="description"

                placeholder="Description"

                onChange={handleChange}

                style={{
                  width: "100%",

                  padding: "14px",

                  borderRadius: "10px",

                  marginBottom: "15px",

                  border: "none",

                  background: "#334155",

                  color: "white"
                }}
              />


              {/* TASKER */}
              <select
                name="assignedTo"

                onChange={handleChange}

                style={{
                  width: "100%",

                  padding: "14px",

                  borderRadius: "10px",

                  marginBottom: "15px",

                  background: "#334155",

                  color: "white"
                }}
              >

                <option>
                  Select Tasker
                </option>

                {
                  users
                  .filter(
                    (user) =>
                      user.role === "tasker"
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

                style={{
                  width: "100%",

                  padding: "14px",

                  borderRadius: "10px",

                  marginBottom: "15px",

                  background: "#334155",

                  color: "white"
                }}
              >

                <option>
                  Select Reviewer
                </option>

                {
                  users
                  .filter(
                    (user) =>
                      user.role === "reviewer"
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


              <button
                style={{
                  padding: "14px 25px",

                  background:
                    "#3b82f6",

                  color: "white",

                  border: "none",

                  borderRadius: "10px",

                  cursor: "pointer"
                }}
              >

                Assign Task

              </button>

            </form>

          </div>

        )
      }


      {/* TASK LIST */}
      <div>

        {
          tasks.map((task) => (

            <div
              key={task._id}

              style={{
                background: "#1e293b",

                padding: "20px",

                borderRadius: "16px",

                marginBottom: "20px",

                border:
                  "1px solid #334155"
              }}
            >

              <h2>
                {task.title}
              </h2>

              <p
                style={{
                  color: "#94a3b8",

                  marginTop: "10px"
                }}
              >

                {task.description}

              </p>


              <p
                style={{
                  marginTop: "15px"
                }}
              >

                <strong>
                  Tasker:
                </strong>

                {" "}

                {
                  task.assignedTo?.name
                }

              </p>


              <p>

                <strong>
                  Reviewer:
                </strong>

                {" "}

                {
                  task.reviewer?.name
                }

              </p>


              <p>

                <strong>
                  Status:
                </strong>

                {" "}

                {
                  task.status
                }

              </p>


              {/* TASKER BUTTONS */}
              {
                currentRole === "tasker" && (

                  <div
                    style={{
                      marginTop: "15px"
                    }}
                  >

                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "in-progress"
                        )
                      }

                      style={{
                        marginRight: "10px",

                        padding: "10px",

                        background:
                          "#2563eb",

                        color: "white",

                        border: "none",

                        borderRadius: "8px"
                      }}
                    >

                      Start

                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "review"
                        )
                      }

                      style={{
                        padding: "10px",

                        background:
                          "#eab308",

                        color: "black",

                        border: "none",

                        borderRadius: "8px"
                      }}
                    >

                      Send For Review

                    </button>

                  </div>

                )
              }


              {/* REVIEWER BUTTONS */}
              {
                currentRole === "reviewer" && (

                  <div
                    style={{
                      marginTop: "15px"
                    }}
                  >

                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "approved"
                        )
                      }

                      style={{
                        marginRight: "10px",

                        padding: "10px",

                        background:
                          "#22c55e",

                        color: "white",

                        border: "none",

                        borderRadius: "8px"
                      }}
                    >

                      Approve

                    </button>


                    <button
                      onClick={() =>
                        updateStatus(
                          task._id,
                          "in-progress"
                        )
                      }

                      style={{
                        padding: "10px",

                        background:
                          "#ef4444",

                        color: "white",

                        border: "none",

                        borderRadius: "8px"
                      }}
                    >

                      Reject

                    </button>

                  </div>

                )
              }

            </div>

          ))
        }

      </div>

    </div>
  );
}

export default Tasks;