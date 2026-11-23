import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

const Dashboard = ({ onSkillCreated }) => {
  const navigate = useNavigate();
  const [isShareFormOpen, setIsShareFormOpen] = useState(false);
  const [isMySkillsVisible, setIsMySkillsVisible] = useState(false);
  const [mySkills, setMySkills] = useState([]);
  const [mySkillsStatus, setMySkillsStatus] = useState("idle");
  const [mySkillsError, setMySkillsError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadMySkills() {
    setMySkillsStatus("loading");
    setMySkillsError("");

    try {
      const response = await apiClient.get("/api/skills/mine");
      setMySkills(response.data);
      setMySkillsStatus("success");
    } catch (error) {
      setMySkillsError(
        error.response?.data?.message ?? "Could not load your skills.",
      );
      setMySkillsStatus("error");
    }
  }

  function handleViewMySkills() {
    if (isMySkillsVisible) {
      setIsMySkillsVisible(false);
      return;
    }

    setIsMySkillsVisible(true);
    loadMySkills();
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await apiClient.post("/api/skills", formData);
      onSkillCreated(response.data.skill);
      setFormData({ title: "", description: "", category: "" });
      setIsShareFormOpen(false);
      if (isMySkillsVisible) {
        await loadMySkills();
      }
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ??
          "Could not share skill. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <h1>Skill Dashboard</h1>

      <p>Welcome to your SkillBridge dashboard!</p>
      <p>Manage your skills and keep track of your learning requests here.</p>

      <h2>My Skills</h2>
      <p>View and manage the skills you share with other students.</p>
      <button
        type="button"
        aria-expanded={isMySkillsVisible}
        aria-controls="my-skills-list"
        onClick={handleViewMySkills}
      >
        {isMySkillsVisible ? "Hide My Skills" : "View My Skills"}
      </button>
      {isMySkillsVisible && (
        <section id="my-skills-list" aria-live="polite">
          {mySkillsStatus === "loading" && (
            <p role="status">Loading your skills...</p>
          )}
          {mySkillsStatus === "error" && <p role="alert">{mySkillsError}</p>}
          {mySkillsStatus === "success" && mySkills.length === 0 && (
            <p>You have not shared any skills yet.</p>
          )}
          {mySkillsStatus === "success" &&
            mySkills.map((skill) => (
              <div key={skill.id}>
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
                <p>Category: {skill.category}</p>
              </div>
            ))}
        </section>
      )}

      <h2>My Requests</h2>
      <p>Check the status of your requests to learn new skills.</p>
      <button>View My Requests</button>

      <h2>Quick Actions</h2>
      <button
        type="button"
        aria-expanded={isShareFormOpen}
        aria-controls="share-skill-form"
        onClick={() => setIsShareFormOpen((isOpen) => !isOpen)}
      >
        {isShareFormOpen ? "Cancel" : "Share a Skill"}
      </button>

      {isShareFormOpen && (
        <form id="share-skill-form" onSubmit={handleSubmit}>
          <h3>Share a skill</h3>
          <label>
            Skill title
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Category
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </label>
          {submitError && <p role="alert">{submitError}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sharing..." : "Submit Skill"}
          </button>
        </form>
      )}

      <button type="button" onClick={() => navigate("/")}>
        Find a Skill
      </button>
    </div>
  );
};

export default Dashboard;
