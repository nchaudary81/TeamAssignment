import React, { useState, useEffect } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";

import apiClient from "./services/api";
import Login from "./frontend/Login";
import Register from "./frontend/Register";

const App = () => {
    const [token, setToken] = useState(() =>
        sessionStorage.getItem("token")
    );

    const [skills, setSkills] = useState([]);
    const [skillsStatus, setSkillsStatus] = useState("idle");
    const [skillsError, setSkillsError] = useState("");

    // Save JWT token after successful login
    function handleLogin(newToken) {
        sessionStorage.setItem("token", newToken);
        setToken(newToken);
    }

    // Load skills when a user is logged in
    useEffect(() => {
        if (!token) {
            setSkills([]);
            setSkillsStatus("idle");
            setSkillsError("");
            return;
        }

        let active = true;

        async function fetchSkills() {
            setSkillsStatus("loading");
            setSkillsError("");

            try {
                const response = await apiClient.get("/api/skills");

                if (active) {
                    setSkills(response.data);
                    setSkillsStatus("success");
                }

            } catch (error) {
                if (active) {
                    setSkillsError(
                        error.response?.data?.message ??
                        "Could not load skills. Please try again."
                    );

                    setSkillsStatus("error");

                    // Clear invalid or expired login sessions
                    if (error.response?.status === 401) {
                        sessionStorage.removeItem("token");
                        setToken(null);
                    }
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

                        {/* Protected dashboard route */}
                        <Route
                            path="/dashboard"
                            element={
                                token ? (
                                    <Dashboard
                                        skills={skills}
                                        skillsStatus={skillsStatus}
                                        skillsError={skillsError}
                                        onSkillCreated={(skill) => {
                                            setSkills((currentSkills) => [
                                                skill,
                                                ...currentSkills,
                                            ]);
                                            setSkillsStatus("success");
                                            setSkillsError("");
                                        }}
                                    />
                                ) : (
                                    <Navigate to="/login" replace />
                                )
                            }
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                        <Route
                            path="/login"
                            element={<Login onLogin={handleLogin} />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                    </Routes>
                </main>

                <div>
                    {skills.map((skill) => (
                        <div key={skill.id}>
                            {skill.name}
                        </div>
                    ))}
                </div>

                <Footer />

            </div>
        </Router>
    );
};

export default App;
