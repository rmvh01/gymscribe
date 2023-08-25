import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";

function ExercisesList() {
  const [exercises, setExercises] = useState([]);
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const { workout_id } = useParams();

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/exercises");
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
      const response = await fetch(`http://localhost:8000/api/workout_exercise`);
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
 //remove the exercise from exercise list
    setExercises((oldExercises) => {
       const newExercises = oldExercises.filter((e) => e.id !== exerciseToAdd.id)
       return newExercises
    })
    const url = "http://localhost:8000/api/workout_exercise/"
    content = {
        "workout_id": workout_id,
        "exercise_id": exerciseToAdd.id}
    const fetchConfig = {
        method: 'POST',
        body: content,
        headers:{
            'Content-Type':'application/json',
        }
    }
    const response = await fetch(url,fetchConfig)
    if(response.ok){
        console.log(response.json(),"success!")

        setWorkoutExercises((oldWorkoutExercises) => {
            const newWorkoutExercises = [...oldWorkoutExercises,exerciseToAdd.name]
            return newWorkoutExercises
        })}

  useEffect(() => {
    fetchData();
    if (workout_id) {
      fetchWorkoutExercises();
    }
  }, [workout_id]);

//   const workoutUrl = "http://localhost:8000/api/workout_exercise/"
//         data = JSON.stringify(data)
//         const fetchConfig = {
//             method: "POST",
//             body: data,
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             }
//         };
//         const response = fetch(
//             workoutUrl, fetchConfig
//         );
//         if (response.ok) {
//             setExercises('');
//             setWorkoutExercises('');
//             console.log("Workout Created Successfully");
//         }
//         else {console.log("Workout could not be post")}
//     };



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
                  <tr key={exercise.id}>
                    <td>{exercise.name}</td>
                    <td>{exercise.description}</td>
                    <td>
                    <button
                    onClick={() => postExerciseToWorkoutExercises(exercise)}
                    className="btn btn-primary">
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
              workoutExercises.map((exercise) => {
                return (
                  <tr key={exercise.id}>
                    <td>{exercise.name}</td>
                    <td>{exercise.description}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
}
export default ExercisesList;
