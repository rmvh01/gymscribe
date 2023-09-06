import React from "react";
import { Link } from "react-router-dom";
import "../styles.css"; // Assuming styles.css is in the same directory

function LandingPage() {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Gymscribe</h1>
      <p className="landing-subtitle">
        Welcome to Gymscribe. Your favorite Workout Log. Login to get started.
      </p>
      <Link to="/login" className="landing-login-button-link">
        <button className="landing-login-button">Login</button>
      </Link>
    </div>
  );
}

export default LandingPage;
