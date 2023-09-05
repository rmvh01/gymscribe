import React from "react";
import { Link } from "react-router-dom";

function LoginLandingPageNewUser() {
  return (
    <div>
      <button
        as={Link}
        to="/Create-Form"
        className="create-first-workout-button"
      >
        Create your first Workout!
      </button>
    </div>
  );
}
export default LoginLandingPageNewUser;
