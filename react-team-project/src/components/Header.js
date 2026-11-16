import React from 'react'
import { Link, useLocation } from "react-router-dom"

const Header = () => {
  
  // eslint-disable-next-line
  const location = useLocation()

  return (
    <div className='header'>
      <h1>SkillBridge</h1>

      <nav>
        <Link to="/login">Login</Link>
        {" | "}
        <Link to="/register">Register</Link>
        {" | "}
        <Link to="/">Home</Link>{" | "}
        <Link to="/dashboard">Dashboard</Link>{" | "}
        <Link to="/about">About</Link>
      </nav>

    </div>
  )
}

export default Header