import React from "react";

const Home = ({ skills }) => {
  return (
    <div>
      <h1>Welcome to SkillBridge</h1>
      <p>
        SkillBridge helps college students share their skills and learn from
        others.
      </p>

      <h2>Available Skills</h2>

      {skills.map((skill) => (
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
