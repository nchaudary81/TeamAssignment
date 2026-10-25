import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import About from "./pages/About"
import Header from './components/Header'
import Footer from "./components/Footer"



const App = () => {
  return (
    <Router> 
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </Router>
  );
}

export default App;
