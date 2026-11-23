import React from "react";

const About = () => {
  return (
    <div className="about-container">
      <section className="about-intro">
        <h1>About Our Team</h1>

        <p>
          We are Team NKL, and we created SkillBridge, a skills-based web
          application that helps students recognize their own skills and learn
          new skills from fellow students.
        </p>
      </section>

      <section className="team-section">
        <h2>Meet Our Members</h2>

        <div className="team-members">
          <div className="team-card">
            <h3>Kseniya Ramanouskaya</h3>
            <p>Student and member of Team NKL.</p>
          </div>

          <div className="team-card">
            <h3>Lauren Ford</h3>
            <p>Student and member of Team NKL.</p>
          </div>

          <div className="team-card">
            <h3>Naba Chaudary</h3>
            <p>Student and member of Team NKL.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
