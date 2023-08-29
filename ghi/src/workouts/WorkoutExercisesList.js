import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react"; // Uncomment if you use this

function ExercisesList() {
  const { token } = useToken();
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const { workout_id } = useParams();

  // i can fetch the workout data to get the user_id

  const fetchData = async () => {
    // this try is to get the user_id
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/exercises`
      );
      if (response.ok) {
        // needs to only be exercises for a given user
        const workoutByIdResponse = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/workout/${workout_id}`
        );
        if (workoutByIdResponse.ok) {
          const workoutByIdJson = await workoutByIdResponse.json();
          const usr_id = workoutByIdJson.user_id;
          const jsonData = await response.json();
          console.log(jsonData[0].user_id);
          const filteredExercises = jsonData.filter(
            (exercise) => exercise.user_id === usr_id
          );
          console.log("jsonData from fetchData:", jsonData);
          console.log("filtered jsondata", filteredExercises); // list of objects
          // now for each of these exercises, we need to add the exercise data
          fetchWorkoutExercises(filteredExercises);
          // const twiceFiltered = workoutExercises.filter((exercise) => {
          //   return !workoutExercises.some(
          //     (existing_exercise) => existing_exercise.id === exercise.id
          //   );
          // });
          // setExercises(twiceFiltered);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchWorkoutExercises = async (filteredExercises) => {
    try {
      const workoutExercisesResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workout/${workout_id}/exercises`
      );
      if (workoutExercisesResponse.ok) {
        const workoutExercisesJson = await workoutExercisesResponse.json(); // list of ids
        // this is where i update workout exercises json with exercises data
        const newWorkoutExercises = workoutExercisesJson.map((id) => {
          const relatedExercise = filteredExercises.find(
            (exercise) => exercise.id === id
          );
          return relatedExercise || id;
        });

        console.log("THISSSSS", newWorkoutExercises);
        setWorkoutExercises(newWorkoutExercises);
        // Filter the workoutExercises again
        const twiceFiltered = newWorkoutExercises.filter((exercise) => {
          return !newWorkoutExercises.some(
            (existing_exercise) => existing_exercise.id === exercise.id
          );
        });
        console.log("this::::", twiceFiltered);
        setExercises(twiceFiltered);
        console.log(workoutExercises);
      } else {
        console.log("failed to fetch workout_exercises");
      }
    } catch (error) {
      console.log("error fetching workout exercises");
    }
  };

  const newWorkoutID = parseInt(workout_id);
  const postExerciseToWorkoutExercises = async (exerciseToAdd) => {
    const addedExerciseData = exercises.find((e) => e.id === exerciseToAdd.id);
    console.log("added", addedExerciseData); // this has the exercise data
    // Remove the exercise from exercise list
    setExercises((oldExercises) => {
      const newExercises = oldExercises.filter(
        (e) => e.id !== exerciseToAdd.id
      );
      return newExercises;
    });
    const url = `${process.env.REACT_APP_API_HOST}/api/workout_exercise`;
    const content = {
      workout_id: newWorkoutID,
      exercise_id: exerciseToAdd.id,
    };
    console.log("Posting the following content:", content); // Added console.log
    const fetchConfig = {
      method: "POST",
      body: JSON.stringify(content),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, fetchConfig);
    if (response.ok) {
      console.log("Success!");
      setWorkoutExercises((oldWorkoutExercises) => {
        if (oldWorkoutExercises) {
          const newWorkoutExerices = {
            exercise_id: exerciseToAdd.id,
            exerciseData: addedExerciseData,
          };
          console.log("newWorkoutExercises", newWorkoutExerices);
          const newWorkoutExercises = [
            ...oldWorkoutExercises,
            newWorkoutExerices,
          ];
          return newWorkoutExercises;
        } else {
          const newWorkoutExercises = [
            {
              exercise_id: exerciseToAdd.id,
              exercise_data: addedExerciseData,
            },
          ];
          console.log("asdf");
          return newWorkoutExercises;
        }
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                // Filter out exercises that are already in workoutExercises
                const exerciseNotInWorkout = !workoutExercises.some(
                  (workoutExercise) =>
                    workoutExercise.exercise_id === exercise.id
                );
                if (exerciseNotInWorkout) {
                  return (
                    <tr key={exercise.id + exercise.name}>
                      <td>{exercise.name}</td>
                      <td>{exercise.description}</td>
                      <td>
                        <button
                          onClick={() =>
                            postExerciseToWorkoutExercises(exercise)
                          }
                          className="btn btn-primary"
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  );
                }
                return null;
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
            {workoutExercises === null ? (
              <tr>
                <td colSpan="2">Loading...</td>
              </tr>
            ) : (
              workoutExercises &&
              workoutExercises.map((workoutExercises, index) => {
                const { exerciseData } = workoutExercises;
                return (
                  <tr key={"" + workoutExercises.id + index}>
                    <td>{exerciseData ? exerciseData.name : "Loading..."}</td>
                    <td>
                      {exerciseData ? exerciseData.description : "Loading..."}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExercisesList;
