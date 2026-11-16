import React from "react";

const Home = ({ skills, skillsStatus, skillsError }) => {
  return (
    <div>
      <h1>Welcome to SkillBridge</h1>
      <p>
        SkillBridge helps college students share their skills and learn from
        others.
      </p>

      <h2>Available Skills</h2>

      {skillsStatus === "loading" && <p role="status">Loading skills...</p>}
      {skillsStatus === "error" && <p role="alert">{skillsError}</p>}
      {skillsStatus === "idle" && <p>Log in to load skills.</p>}
      {skillsStatus === "success" && skills.length === 0 && (
        <p>No skills found yet.</p>
      )}

      {skillsStatus === "success" &&
        skills.map((skill) => (
          <div key={skill.id}>
            <h3>{skill.title}</h3>
            <p>Category: {skill.category}</p>
            <p>Provider: {skill.providerName}</p>
            <p>{skill.description}</p>
          </div>
        ))}
    </div>
  );
};

export default Home;
