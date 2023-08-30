import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";

function ShowOneWorkout() {
  const { workout_id } = useParams();
  const [workoutdata, setWorkoutData] = useState({});
  const { token } = useToken();
  const [metricValue, setMetricValue] = useState();
  const [metricId, setMetricId] = useState();
  const [exerciseId, setExerciseId] = useState();

  const fetchData = async () => {
    const newWorkoutId = parseInt(workout_id);
    const url = `${process.env.REACT_APP_API_HOST}/api/workout/${newWorkoutId}`;
    const response = await fetch(url);
    const json = await response.json();
    setWorkoutData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (Object.keys(workoutdata).length === 0) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/metric_values`;
    let data = {
      metric_id: Number(metricId),
      value: Number(metricValue),
      exercise_id: Number(exerciseId),
    };
    data = JSON.stringify(data);
    console.log(data);
    const fetchConfig = {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, fetchConfig);
      if (response.ok) {
        console.log("post successful");
      }
    } catch {
      console.log("failed to post");
    }
  };

  const handleChange = (e) => {
    const stringToParse = String(e.target.name);
    console.log(e.target.value);
    let metricID = "";
    let exerciseID = "";
    let trigger = false;
    for (let i = 0; i < stringToParse.length; i++) {
      if (stringToParse[i] !== "_" && trigger === false) {
        metricID += stringToParse[i];
      } else if (stringToParse[i] === "_") {
        trigger = true;
      } else {
        exerciseID += stringToParse[i];
      }
    }
    console.log(metricID, exerciseID);
    setMetricValue(e.target.value);
    setMetricId(metricID);
    setExerciseId(exerciseID);
  };

  return (
    <div className="workout-container">
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
            <tr key={`${exercise.id}_exercises_map`}>
              <th>{exercise.name}</th>
              {workoutdata.metrics.map((metric) => (
                <td key={`${metric.id}_metric_map`}>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      onChange={handleChange}
                      name={`${metric.id}_${exercise.id}`}
                    />
                    <button type="submit">+</button>
                  </form>
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
