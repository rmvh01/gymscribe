import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";
import "../styles.css";


function WorkoutExercisesList() {
  const { token } = useToken();
  const navigate = useNavigate();
  const { workout_id } = useParams();
  const [exercisesNotInWorkout, setExercisesNotInWorkout] = useState([]);
  const [exercisesInWorkout, setExercisesInWorkout] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(false);

  const fetchData = async () => {
    const filteredExerciseData = await fetchExerciseData();
    const exerciseIdList = await fetchWorkoutExerciseIds(workout_id);
    const exercisesIn = [];
    const exercisesOut = [];
    for (let exercise of filteredExerciseData) {
      if (exerciseIdList.includes(exercise.id)) {
        exercisesIn.push(exercise);
      } else {
        exercisesOut.push(exercise);
      }
      setExercisesInWorkout(exercisesIn);
      setExercisesNotInWorkout(exercisesOut);
    }
  };

  useEffect(() => {
    fetchData();
  }, [forceRefresh]);

  const fetchWorkoutExerciseIds = async (workout_id) => {
    try {
      const workoutExercisesResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workouts/${workout_id}/exercises`
      );
      if (workoutExercisesResponse.ok) {
        const workoutExercisesJson = await workoutExercisesResponse.json();
        return workoutExercisesJson;
      } else {
        return [];
      }
    } catch {
      console.log("failed to fetch workout exercises id list");
      return [];
    }
  };

  const fetchExerciseData = async () => {
    try {
      const url = `${process.env.REACT_APP_API_HOST}/api/exercises`;
      const fetchConfig = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const exercisesResponse = await fetch(url, fetchConfig);
      if (exercisesResponse.ok) {
        const exercisesJson = await exercisesResponse.json();
        const user_id = await fetchUserId();
        const newExercises = [];
        for (let exercise of exercisesJson) {
          if (exercise.user_id === user_id) {
            newExercises.push(exercise);
          }
        }
        return newExercises;
      }
    } catch {
      console.log("failed to fetch exercise data");
    }
  };

  const fetchUserId = async () => {
    try {
      const workoutDetailResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workouts/${workout_id}`
      );
      if (workoutDetailResponse.ok) {
        const workoutDetailJson = await workoutDetailResponse.json();
        const user_id = workoutDetailJson.user_id;
        return user_id;
      }
    } catch {
      console.log("failed to fetch workout details");
    }
  };

  const postExerciseToWorkoutExercises = async (exercise) => {
    const url = `${process.env.REACT_APP_API_HOST}/api/workout_exercises`;
    const newWorkoutId = parseInt(workout_id);
    const content = {
      exercise_id: exercise.id,
      workout_id: newWorkoutId,
    };
    const data = JSON.stringify(content);
    const fetchConfig = {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      console.log("Exercise posted to workout_exercises table");
      if (forceRefresh) {
        setForceRefresh(false);
      } else {
        setForceRefresh(true);
      }
    } else {
      console.log("exercise could not be posted");
    }
  };

  const removeExerciseFromWorkout = async (exercise) => {
    const newWorkoutId = parseInt(workout_id);
    const url = `${process.env.REACT_APP_API_HOST}/api/${newWorkoutId}/${exercise.id}`;
    const fetchConfig = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      console.log("exercise removed from workout");
      if (forceRefresh) {
        setForceRefresh(false);
      } else {
        setForceRefresh(true);
      }
    }
  };

  if (!token) {
    return <p>Sign up and log in to access the home page.</p>;
  }

  return (
    <div className="container">
      <div className="exercises-not-in-workout-section">
        <h1 className="text-center mb-3">Exercises</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {exercisesNotInWorkout.map((exercise) => (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.description}</td>
                <td>
                  <button
                    onClick={() => postExerciseToWorkoutExercises(exercise)}
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate("/exercises")}>
          Create an Exercise
        </button>
      </div>

      <div className="exercises-in-workout-section">
        <h1 className="text-center mb-3">Exercises In Workout</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {exercisesInWorkout.map((exercise) => (
              <tr key={exercise.id}>
                <td>{exercise.name}</td>
                <td>{exercise.description}</td>
                <td>
                  <button onClick={() => removeExerciseFromWorkout(exercise)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={() => navigate(`/workout/${workout_id}/metrics`)}>
          Define Metrics
        </button>
      </div>
    </div>
  );
}

export default WorkoutExercisesList;
