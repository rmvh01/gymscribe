import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import LoginForm from "./Login";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import LandingPage from "./users/LandingPage";
import LoginLandingPageNewUser from "./workouts/CreateWorkout";
import WorkoutForm from "./workouts/WorkoutForm";


function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="app">
        <nav>
          <Link to="/signup">Sign Up</Link>
          <Link to="/login">Login</Link>
          <Link to="/">Home</Link>
        </nav>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/LandingPageNewUser" element={<LoginLandingPageNewUser />} />
          <Route path="/WorkoutForm" element={<WorkoutForm />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
