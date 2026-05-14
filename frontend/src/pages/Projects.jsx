import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import API from "../api";

function Projects() {

  const navigate =
    useNavigate();

  const token =
    localStorage.getItem("token");


  const [projects, setProjects] =
    useState([]);

  const [formData, setFormData] =
    useState({

      title: "",
      description: ""

    });


  // FETCH PROJECTS
  const fetchProjects =
    async () => {

      try {

        const res =
          await API.get(

            "/projects",

            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }

          );

        console.log(res.data);

        setProjects(
          res.data
        );

      } catch (error) {

        console.log(error);

      }

    };


  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };


  // CREATE PROJECT
  const createProject =
    async (e) => {

      e.preventDefault();

      try {

        await API.post(

          "/projects",

          formData,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }

        );

        alert(
          "Project Created Successfully"
        );

        // REFRESH PROJECTS
        await fetchProjects();

        // CLEAR FORM
        setFormData({

          title: "",
          description: ""

        });

      } catch (error) {

        console.log(
          error.response?.data
        );

        alert(
          error.response?.data?.message
        );

      }

    };


  useEffect(() => {

    fetchProjects();

  }, []);


  return (

    <div
      style={{
        background:
          "#020617",

        minHeight:
          "100vh",

        color:
          "white",

        padding:
          "40px"
      }}
    >

      <h1
        style={{
          marginBottom:
            "30px"
        }}
      >

        Projects Workspace

      </h1>


      {/* CREATE PROJECT */}
      <div
        style={{
          background:
            "#1e293b",

          padding:
            "25px",

          borderRadius:
            "16px",

          marginBottom:
            "30px"
        }}
      >

        <h2
          style={{
            marginBottom:
              "20px"
          }}
        >

          Create Project

        </h2>


        <form
          onSubmit={
            createProject
          }
        >

          <input
            type="text"

            name="title"

            placeholder="Project Title"

            value={
              formData.title
            }

            onChange={
              handleChange
            }

            required

            style={{
              width:
                "100%",

              padding:
                "14px",

              borderRadius:
                "10px",

              marginBottom:
                "15px",

              border:
                "none",

              background:
                "#334155",

              color:
                "white"
            }}
          />


          <input
            type="text"

            name="description"

            placeholder="Description"

            value={
              formData.description
            }

            onChange={
              handleChange
            }

            required

            style={{
              width:
                "100%",

              padding:
                "14px",

              borderRadius:
                "10px",

              marginBottom:
                "15px",

              border:
                "none",

              background:
                "#334155",

              color:
                "white"
            }}
          />


          <button
            type="submit"

            style={{
              padding:
                "14px 25px",

              background:
                "#3b82f6",

              color:
                "white",

              border:
                "none",

              borderRadius:
                "10px",

              cursor:
                "pointer"
            }}
          >

            Create Project

          </button>

        </form>

      </div>


      {/* PROJECT LIST */}
      <div>

        {
          projects.length === 0 && (

            <h2>
              No Projects Found
            </h2>

          )
        }

        {
          projects.map(
            (project) => (

              <div
                key={
                  project._id
                }

                style={{
                  background:
                    "#1e293b",

                  padding:
                    "20px",

                  borderRadius:
                    "16px",

                  marginBottom:
                    "20px"
                }}
              >

                <h2>
                  {
                    project.title
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#94a3b8",

                    marginTop:
                      "10px"
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

                  style={{
                    marginTop:
                      "15px",

                    padding:
                      "12px 20px",

                    background:
                      "#2563eb",

                    color:
                      "white",

                    border:
                      "none",

                    borderRadius:
                      "10px",

                    cursor:
                      "pointer"
                  }}
                >

                  Open Tasks

                </button>

              </div>

            )
          )
        }

      </div>

    </div>

  );
}

export default Projects;
