import React from "react";
import { BrowserRouter as Router, Route, Link, Routes, useParams } from "react-router-dom";
import SignUp from "./SignUp";
import LoginForm from "./Login";
import { AuthProvider } from "@galvanize-inc/jwtdown-for-react";
import LandingPage from "./users/LandingPage";
import LoginLandingPageNewUser from "./workouts/CreateWorkout";
import WorkoutForm from "./workouts/WorkoutForm";
import ExercisesList from "./workouts/WorkoutExercisesList";

function App() {
  return (
    <AuthProvider baseUrl="http://localhost:8000">
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
          <Route path="">
            <Route path=":workout_id" element={<ExercisesList />} />
            <Route path=":workout_id" element={<WorkoutForm />} />
          </Route>
          {/* <Route path="/WorkoutExercises" element={<ExercisesList />} /> */}

        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
