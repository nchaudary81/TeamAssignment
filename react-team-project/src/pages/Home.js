import React from "react";

const Home = ({ skills, skillsStatus, skillsError }) => {
  return (
    <div className="home-container">
      <section className="home-intro">
        <h1>Welcome to SkillBridge</h1>
        <p>
          SkillBridge helps college students share their skills and learn from
          others.
        </p>
      </section>

      <section className="skills-section">
        <h2>Available Skills</h2>

        {skillsStatus === "loading" && (
          <p role="status" className="skills-message">
            Loading skills...
          </p>
        )}
        {skillsStatus === "error" && (
          <p role="alert" className=" skills-message skills-error">
            {skillsError}
          </p>
        )}
        {skillsStatus === "idle" && (
          <p className="skills-message">Log in to load skills.</p>
        )}
        {skillsStatus === "success" && skills.length === 0 && (
          <p className="skills-message">No skills found yet.</p>
        )}

        {skillsStatus === "success" && skills.length > 0 && (
          <div className="skills-grid">
            {skills.map((skill) => (
              <div className="skill-card" key={skill.id}>
                <h3>{skill.title}</h3>
                <p className="skill-category">Category: {skill.category}</p>
                <p>Provider: {skill.providerName}</p>
                <p>{skill.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
