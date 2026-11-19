import React from 'react'
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <>
      <header className="header">
        <h1>SkillBridge</h1>
      </header>
      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/about">About</Link>
      </nav>
    </>
  )
}

export default Header