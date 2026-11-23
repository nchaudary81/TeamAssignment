import React, { useState } from "react";
import apiClient from "../services/api";

const Dashboard = ({
  skills,
  skillsStatus,
  skillsError,
  onSkillCreated,
}) => {
  const [isShareFormOpen, setIsShareFormOpen] = useState(false);
  const [isMySkillsVisible, setIsMySkillsVisible] = useState(false);
  const [isFindSkillsVisible, setIsFindSkillsVisible] = useState(false);
  const [mySkills, setMySkills] = useState([]);
  const [mySkillsStatus, setMySkillsStatus] = useState("idle");
  const [mySkillsError, setMySkillsError] = useState("");
  const [requests, setRequests] = useState([]);
  const [requestsStatus, setRequestsStatus] = useState("idle");
  const [requestsError, setRequestsError] = useState("");
  const [isRequestsVisible, setIsRequestsVisible] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [receivedRequestsStatus, setReceivedRequestsStatus] = useState("idle");
  const [receivedRequestsError, setReceivedRequestsError] = useState("");
  const [isReceivedRequestsVisible, setIsReceivedRequestsVisible] =
    useState(false);
  const [requestingSkillId, setRequestingSkillId] = useState(null);
  const [requestNotices, setRequestNotices] = useState({});
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

  async function loadMyRequests() {
    setRequestsStatus("loading");
    setRequestsError("");

    try {
      const response = await apiClient.get("/api/requests");
      setRequests(response.data);
      setRequestsStatus("success");
    } catch (error) {
      setRequestsError(
        error.response?.data?.message ?? "Could not load your requests.",
      );
      setRequestsStatus("error");
    }
  }

  async function loadReceivedRequests() {
    setReceivedRequestsStatus("loading");
    setReceivedRequestsError("");

    try {
      const response = await apiClient.get("/api/requests/received");
      setReceivedRequests(response.data);
      setReceivedRequestsStatus("success");
    } catch (error) {
      setReceivedRequestsError(
        error.response?.data?.message ?? "Could not load received requests.",
      );
      setReceivedRequestsStatus("error");
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

  async function handleRequestSubmit(skillId) {
    setRequestNotices((current) => ({ ...current, [skillId]: null }));
    setRequestingSkillId(skillId);

    try {
      const response = await apiClient.post("/api/requests", {
        skillId,
      });
      setRequestNotices((current) => ({
        ...current,
        [skillId]: {
          kind: "success",
          message: response.data.message,
        },
      }));
      if (isRequestsVisible) {
        await loadMyRequests();
      }
    } catch (error) {
      setRequestNotices((current) => ({
        ...current,
        [skillId]: {
          kind: "error",
          message:
            error.response?.data?.message ??
            "Could not send request. Please try again.",
        },
      }));
    } finally {
      setRequestingSkillId(null);
    }
  }

  return (
  <div className="dashboard-container">

    <div className="dashboard-intro">
      <h1>Skill Dashboard</h1>

      <p>Welcome to your SkillBridge dashboard!</p>
      <p>Manage your skills and keep track of your learning requests here.</p>
    </div>
    
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
      <button
        type="button"
        aria-expanded={isRequestsVisible}
        aria-controls="my-requests-list"
        onClick={() => {
          if (isRequestsVisible) {
            setIsRequestsVisible(false);
            return;
          }

          setIsRequestsVisible(true);
          loadMyRequests();
        }}
      >
        {isRequestsVisible ? "Hide My Requests" : "View My Requests"}
      </button>
      {isRequestsVisible && (
        <section id="my-requests-list" aria-live="polite">
          {requestsStatus === "loading" && (
            <p role="status">Loading your requests...</p>
          )}
          {requestsStatus === "error" && <p role="alert">{requestsError}</p>}
          {requestsStatus === "success" && requests.length === 0 && (
            <p>You have not requested any skills yet.</p>
          )}
          {requestsStatus === "success" &&
            requests.map((request) => (
              <div key={request.id}>
                <h3>{request.skillTitle}</h3>
                <p>Provider: {request.providerName}</p>
                <p>Status: {request.status}</p>
                {request.message && <p>Your message: {request.message}</p>}
              </div>
            ))}
        </section>
      )}
      <button
        type="button"
        aria-expanded={isReceivedRequestsVisible}
        aria-controls="received-requests-list"
        onClick={() => {
          if (isReceivedRequestsVisible) {
            setIsReceivedRequestsVisible(false);
            return;
          }

          setIsReceivedRequestsVisible(true);
          loadReceivedRequests();
        }}
      >
        {isReceivedRequestsVisible
          ? "Hide Requests for My Skills"
          : "View Requests for My Skills"}
      </button>
      {isReceivedRequestsVisible && (
        <section id="received-requests-list" aria-live="polite">
          {receivedRequestsStatus === "loading" && (
            <p role="status">Loading received requests...</p>
          )}
          {receivedRequestsStatus === "error" && (
            <p role="alert">{receivedRequestsError}</p>
          )}
          {receivedRequestsStatus === "success" &&
            receivedRequests.length === 0 && (
              <p>No one has requested your skills yet.</p>
            )}
          {receivedRequestsStatus === "success" &&
            receivedRequests.map((request) => (
              <div key={request.id}>
                <h3>{request.skillTitle}</h3>
                <p>From: {request.requesterName}</p>
                <p>Status: {request.status}</p>
                {request.message && <p>Message: {request.message}</p>}
              </div>
            ))}
        </section>
      )}

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

      <button
        type="button"
        aria-expanded={isFindSkillsVisible}
        aria-controls="available-skills-list"
        onClick={() => setIsFindSkillsVisible((isVisible) => !isVisible)}
      >
        {isFindSkillsVisible ? "Hide Available Skills" : "Find a Skill"}
      </button>
      {isFindSkillsVisible && (
        <section id="available-skills-list" aria-live="polite">
          <h2>Available Skills</h2>
          {skillsStatus === "loading" && (
            <p role="status">Loading skills...</p>
          )}
          {skillsStatus === "error" && <p role="alert">{skillsError}</p>}
          {skillsStatus === "success" && skills.length === 0 && (
            <p>No skills found yet.</p>
          )}
          {skillsStatus === "success" &&
            skills.map((skill) => (
              <div key={skill.id}>
                <h3>{skill.title}</h3>
                <p>Category: {skill.category || "Not specified"}</p>
                <p>Provider: {skill.providerName || "You"}</p>
                <p>{skill.description || "No description provided."}</p>
                {requestNotices[skill.id]?.kind === "success" && (
                  <p role="status">{requestNotices[skill.id].message}</p>
                )}
                {requestNotices[skill.id]?.kind !== "success" && (
                  <button
                    type="button"
                    disabled={requestingSkillId !== null}
                    onClick={() => handleRequestSubmit(skill.id)}
                  >
                    {requestingSkillId === skill.id
                      ? "Sending..."
                      : "Request to Learn"}
                  </button>
                )}
                {requestNotices[skill.id]?.kind === "error" && (
                  <p role="alert">{requestNotices[skill.id].message}</p>
                )}
              </div>
            ))}
        </section>
      )}
    </div>
  );
};

export default Dashboard;
