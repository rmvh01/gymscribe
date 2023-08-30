import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";

function ShowOneWorkout() {
  const { workout_id } = useParams();
  const [workoutdata, setWorkoutData] = useState({});

  const fetchData = async () => {
    const newWorkoutId = parseInt(workout_id);
    const url = `${process.env.REACT_APP_API_HOST}/api/workout/${newWorkoutId}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    setWorkoutData(json);
    console.log(workoutdata.metrics);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (Object.keys(workoutdata).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Workout Name: {workoutdata.name}</h1>
      <h2>Workout Description: {workoutdata.description}</h2>

      <table>
        <thead>
        <tr>
          <th></th>
          {workoutdata.metrics.map((metric) => (
            <th key={metric.id}>{metric.name}</th>
          ))}
        </tr>
        </thead>
        <tbody>
        {/* <!-- Loop through exercise names --> */}
          {workoutdata.exercises.map((exercise) => (
            <tr key={exercise.id}>
              <th>{exercise.name}</th>
              {workoutdata.metrics.map((metric) => (
                <td key={metric.id}>
                  <input type="text" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ShowOneWorkout;
