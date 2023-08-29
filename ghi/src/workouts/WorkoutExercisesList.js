import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react"; // Uncomment if you use this

// we need:
// one useState for the list of exercises, this should be filtered by user_id, and against the exercises already in the workout
// a second useState for the list of exercises in the workout

function WorkoutExercisesList() {
  // const token, and useState for (exercises not in workout) and one for (exercises in the workout)
  const { token } = useToken();
  const { workout_id } = useParams();
  const [exercisesNotInWorkout, setExercisesNotInWorkout] = useState([]);
  const [exercisesInWorkout, setExercisesInWorkout] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(false);
  // workout_id from use_params to get user_id from get one workout query

  // this block is for initial population

  // fetch workout_exercise data: a list of exercise_ids
  const fetchData = async () => {
    const filteredExerciseData = await fetchExerciseData();
    const exerciseIdList = await fetchWorkoutExerciseIds(workout_id);
    console.log(exerciseIdList);
    const exercisesIn = [];
    const exercisesOut = [];
    console.log(filteredExerciseData);
    for (let exercise of filteredExerciseData) {
      if (exerciseIdList.includes(exercise.id)) {
        exercisesIn.push(exercise);
      } else {
        exercisesOut.push(exercise);
      }
      console.log(exercisesOut);
      console.log(exercisesIn);
      setExercisesInWorkout(exercisesIn);
      setExercisesNotInWorkout(exercisesOut);
    }
  };

  useEffect(() => {
    fetchData();
  }, [forceRefresh]);

  // fetch exercise data: a list of exercise objects filtered by user_id

  // filter that exercise data for the user,

  const fetchWorkoutExerciseIds = async (workout_id) => {
    try {
      const workoutExercisesResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workout/${workout_id}/exercises`
      );
      if (workoutExercisesResponse.ok) {
        const workoutExercisesJson = await workoutExercisesResponse.json();
        return workoutExercisesJson; // this json is a list of exercise_ids that are in the workout
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
      const exercisesResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/exercises`
      );
      if (exercisesResponse.ok) {
        const exercisesJson = await exercisesResponse.json();
        // fitler that json for user_id
        const user_id = await fetchUserId();
        console.log(exercisesJson);
        const newExercises = [];
        for (let exercise of exercisesJson) {
          console.log(user_id);
          if (exercise.user_id === user_id) {
            newExercises.push(exercise);
          }
        }
        console.log(newExercises);
        return newExercises; // these are only the user's exercises
      }
    } catch {
      console.log("failed to fetch exercise data");
    }
  };

  const fetchUserId = async () => {
    try {
      const workoutDetailResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workout/${workout_id}`
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
    // we have an exercise object in exercise
    // we need to the workout_id and the exercise_id to post
    const url = `${process.env.REACT_APP_API_HOST}/api/workout_exercise`;
    const newWorkoutId = parseInt(workout_id);
    const content = {
      exercise_id: exercise.id,
      workout_id: newWorkoutId,
    };
    const data = JSON.stringify(content);
    console.log("content", content);
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
      setForceRefresh(true);
    } else {
      console.log("exercise could not be posted");
    }
  };

  return (
    <div className="container mt-5 pt-1">
      <div className="mt-5">
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkoutExercisesList;
