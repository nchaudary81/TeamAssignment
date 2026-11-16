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
  
  function handleLogin(newToken) {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  }
  useEffect(() => {
    if (!token) return;

    async function fetchSkills() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/skills",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    }

    fetchSkills();
  }, [token]);

  return (
    <Router>
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home skills={skills} />} />
            <Route path="/dashboard" element={<Dashboard skills={skills} />} />
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
