import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react"; // Uncomment if you use this

function WorkoutListView() {
  const { token } = useToken();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);

  // Fetch workout data
  const fetchData = async () => {
    try {
      const workoutDetailResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (workoutDetailResponse.ok) {
        const workoutDetailJson = await workoutDetailResponse.json();
        setWorkouts(workoutDetailJson);
      }
    } catch {
      console.log("failed to fetch workout details");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/exercises`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const exercisesData = await response.json();
        setExercises(exercisesData);
      } catch (error) {
        console.log("Failed to fetch exercises: ", error);
      }
    };

    fetchExercises();
  }, []);

  return (
    <div className="container">
      <div className="workout-section">
        <h1>Workout List</h1>
        <button onClick={() => navigate("/workout")}>Create Workout</button>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((workout) => (
              <tr key={workout.id}>
                <td>{workout.name}</td>
                <td>{workout.description}</td>
                <td>
                  <button
                    onClick={() => navigate(`/workoutform/${workout.id}`)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="exercise-section">
        <h1>Exercise List</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate("/exercises")}>Create Exercise</button>
      </div>
    </div>
  );
}
export default WorkoutListView;
