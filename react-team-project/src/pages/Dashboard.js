import React from "react";

const Dashboard = ({ skills }) => {
  return (
    <div>
      <h1>Skill Dashboard</h1>

      <p>Welcome to your SkillBridge dashboard!</p>
      <p>Manage your skills and keep track of your learning requests here.</p>

      <h2>My Skills</h2>

      {/* Just keep it for now until we add user authentication. */}
      {skills.map((skill) => (
        <div key={skill.id}>
          <h3>{skill.title}</h3>
          <p>{skill.description}</p>
          <p>Category: {skill.category}</p>
        </div>
      ))}

      <p>View and manage the skills you share with other students.</p>
      <button>View My Skills</button>

      <h2>My Requests</h2>
      <p>Check the status of your requests to learn new skills.</p>
      <button>View My Requests</button>

      <h2>Quick Actions</h2>
      <button>Share a Skill</button>
      <button>Find a Skill</button>
    </div>
  );
};

export default Dashboard;
