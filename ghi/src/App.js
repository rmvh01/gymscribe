import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import SignUp from "./users/SignUp";
import LoginForm from "./users/Login";
import LandingPage from "./users/LandingPage";
import WorkoutForm from "./workouts/WorkoutForm";
import ExercisesList from "./workouts/WorkoutExercisesList";
import CreateExercise from "./workouts/CreateExercise";
import CreateMetric from "./workouts/CreateMetric";
import WorkoutListView from "./workouts/WorkoutListView";
import EditWorkoutForm from "./workouts/UpdateWorkoutForm";
import ProfilePage from "./users/ProfilePage";
import WorkoutDetails from "./workouts/WorkoutDetails";

import useToken from "@galvanize-inc/jwtdown-for-react";

function App() {
  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");
  const { token, logout } = useToken();
  async function handleLogout() {
    await logout();
  }
  return (
    <Router basename={basename}>
      <div className="app">
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div>
              <Link to="/workout/list">Home</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login">Login</Link>
              <Link to="/profile">Profile</Link>
            </div>
          </div>
          {token && ( // Only show Logout button if user is logged in
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
        <Routes>
          <Route
            path="/"
            element={token ? <WorkoutListView /> : <LandingPage />}
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="">
            <Route path="/workout/:workout_id" element={<ExercisesList />} />
            <Route path="/workout" element={<WorkoutForm />} />
            <Route path="/exercises" element={<CreateExercise />} />
            <Route
              path="/workout/:workout_id/metrics"
              element={<CreateMetric />}
            />
            <Route
              path="/workout/:workoutId/view"
              element={<WorkoutDetails />}
            />
            <Route path="/workout/list" element={<WorkoutListView />} />
            <Route
              path="/workoutform/:workout_id"
              element={<EditWorkoutForm />}
            />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
