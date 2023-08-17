import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
// import other components and dependencies as needed

function App() {
  return (
    <Router>
      <div className="app">
        <nav>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
          <Link to="/">Home</Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Main App Here</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
