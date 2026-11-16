import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import axios from "axios";
import Login from "./frontend/Login";
import Register from "./frontend/Register";
import { useState, useEffect } from "react";

const App = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [skills, setSkills] = useState([]);
  const [skillsStatus, setSkillsStatus] = useState("idle");
  const [skillsError, setSkillsError] = useState("");

  function handleLogin(newToken) {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  }
  useEffect(() => {
    if (!token) {
      setSkills([]);
      setSkillsStatus("idle");
      return;
    }

    let active = true;

    async function fetchSkills() {
      setSkillsStatus("loading");
      setSkillsError("");

      try {
        const response = await axios.get("http://localhost:8080/api/skills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (active) {
          setSkills(response.data);
          setSkillsStatus("success");
        }
      } catch (error) {
        if (active) {
          setSkillsError(
            error.response?.data?.message ?? "Could not load skills. Please try again."
          );
          setSkillsStatus("error");
        }
      }
    }

    fetchSkills();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <Router>
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  skills={skills}
                  skillsStatus={skillsStatus}
                  skillsError={skillsError}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  skills={skills}
                  skillsStatus={skillsStatus}
                  skillsError={skillsError}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onRegister={handleLogin} />} />
          </Routes>
        </main>

        <div>
          {skills.map((skill) => (
            <div key={skill.id}>{skill.name}</div>
          ))}
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
