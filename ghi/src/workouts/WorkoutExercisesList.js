import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import useToken from "@galvanize-inc/jwtdown-for-react"; // Uncomment if you use this

function ExercisesList() {
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const { workout_id } = useParams();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/exercises`
      );
      if (response.ok) {
        const jsonData = await response.json();
        setExercises(jsonData);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchWorkoutExercises = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workout/${workout_id}/exercises`
      );
      if (response.ok) {
        const jsonData = await response.json();
        setWorkoutExercises(jsonData);
      } else {
        console.error("Failed to fetch workout exercises");
      }
    } catch (error) {
      console.error("Error fetching workout exercises:", error);
    }
  };

  const postExerciseToWorkoutExercises = async (exerciseToAdd) => {
    // Remove the exercise from exercise list
    setExercises((oldExercises) => {
      const newExercises = oldExercises.filter(
        (e) => e.id !== exerciseToAdd.id
      );
      return newExercises;
    });

    const url = `${process.env.REACT_APP_API_HOST}/api/workout_exercise/"`;
    const content = {
      workout_id: workout_id,
      exercise_id: exerciseToAdd.id,
    };
    console.log("Posting the following content:", content); // Added console.log
    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(content), // Stringify the content object
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      console.log("Success!");
      setWorkoutExercises((oldWorkoutExercises) => {
        if (oldWorkoutExercises) {
          console.log("aaaa");
          const newWorkoutExercises = [...oldWorkoutExercises, content];
          return newWorkoutExercises;
        } else {
          const newWorkoutExercises = [];
          console.log("asdf");
          return newWorkoutExercises;
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
    if (workout_id) {
      fetchWorkoutExercises();
    }
  }, [workout_id]);

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
            {exercises &&
              exercises.map((exercise) => {
                return (
                  <tr key={exercise.id + exercise.name}>
                    <td>{exercise.name}</td>
                    <td>{exercise.description}</td>
                    <td>
                      <button
                        onClick={() => postExerciseToWorkoutExercises(exercise)}
                        className="btn btn-primary"
                      >
                        Add
                      </button>
                    </td>
                  </tr>
                );
              })}
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
            {workoutExercises &&
              workoutExercises.map((workoutExercises, index) => {
                return (
                  <tr key={"" + workoutExercises.exercise_id + index}>
                    <td>{workoutExercises}</td>
                    <td>{}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExercisesList;
