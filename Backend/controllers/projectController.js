const Project =
  require("../models/Project");

const Task =
  require("../models/Task");


// CREATE PROJECT
const createProject =
  async (req, res) => {

    try {

      const {
        title,
        description
      } = req.body;

      const project =
        await Project.create({

          title,
          description,

          createdBy:
            req.user.id

        });

      res.status(201).json(
        project
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message
      });

    }

};


// GET PROJECTS
const getProjects =
  async (req, res) => {

    try {

      let projects = [];

      // PROJECT LEAD
      if (
        req.user.role ===
        "projectlead"
      ) {

        projects =
          await Project.find({

            createdBy:
              req.user.id

          });

      }


      // TASKER
      else if (
        req.user.role ===
        "tasker"
      ) {

        const tasks =
          await Task.find({

            assignedTo:
              req.user.id

          });

        const projectIds =
          tasks.map(
            (task) =>
              task.projectId
          );

        projects =
          await Project.find({

            _id: {
              $in:
                projectIds
            }

          });

      }


      // REVIEWER
      else if (
        req.user.role ===
        "reviewer"
      ) {

        const tasks =
          await Task.find({

            reviewer:
              req.user.id

          });

        const projectIds =
          tasks.map(
            (task) =>
              task.projectId
          );

        projects =
          await Project.find({

            _id: {
              $in:
                projectIds
            }

          });

      }

      res.status(200).json(
        projects
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message
      });

    }

};

module.exports = {

  createProject,
  getProjects

};
