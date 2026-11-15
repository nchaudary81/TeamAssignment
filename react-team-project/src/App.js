import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";
import axios from "axios";
import { useState, useEffect } from "react";

const App = () => {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/skills");

        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home skills={skills} />} />
            <Route path="/dashboard" element={<Dashboard skills={skills} />} />
            <Route path="/about" element={<About />} />
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
