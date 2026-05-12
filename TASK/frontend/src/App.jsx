import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks/:projectId" element={<Tasks />} />

      </Routes>

    </BrowserRouter>

  );
}

export default App;