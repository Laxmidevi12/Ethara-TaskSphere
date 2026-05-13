import{Link } from "react-router-dom";

function Sidebar() {

  return (

    <div
      style={{
        width: "250px",
        background: "#020617",
        borderRight: "1px solid #1e293b",
        minHeight: "100vh",
        padding: "20px",
        color: "white"
      }}
    >

      <h1
        style={{
          marginBottom: "40px",
          color: "#38bdf8"
        }}
      >
        Ethara.AI
      </h1>


      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}
      >

        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/projects">
          Projects
        </Link>

        <Link to="/tasks">
          Tasks
        </Link>

        <Link to="/team">
          Team
        </Link>

      </div>

    </div>
  );
}

export default Sidebar;