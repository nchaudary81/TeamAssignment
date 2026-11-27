import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header className="header">
        <h1>SkillBridge</h1>
      </header>
      <nav className="nav-links" aria-label="Main navigation">
        <div className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="nav-right">
          <Link to="/login" className="login-link">
            Login
          </Link>
          <Link to="/register" className="register-link">
            Register
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Header;
