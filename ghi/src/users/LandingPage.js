import React from "react";
import { Link } from "react-router-dom";
import "../styles.css";
import useToken from "@galvanize-inc/jwtdown-for-react";

function LandingPage() {
  const {token} = useToken()
  console.log("token:", token)
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
