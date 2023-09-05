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
  const [existence, setExistence] = useState("");

  const fetchData = async () => {
    const newWorkoutId = parseInt(workout_id);
    const url = `${process.env.REACT_APP_API_HOST}/api/workouts/${newWorkoutId}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
    console.log(json.metric_values);
    setWorkoutData(json);
  };
  useEffect(() => {
    fetchData();
  }, [metricValue]);

  if (Object.keys(workoutdata).length === 0) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existence === "_") {
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
    } else {
      for (let value of workoutdata.metric_values) {
        if (
          Number(value.exercise_id) === Number(exerciseId) &&
          Number(value.metric_id) === Number(metricId)
        ) {
          // do the put
          const metric_value_id = value.id;
          console.log(metric_value_id);
          const mvUrl = `${process.env.REACT_APP_API_HOST}/api/metric_values/${metric_value_id}`;
          let data = {
            metric_id: value.metric_id,
            exercise_id: value.exercise_id,
            value: metricValue,
          };
          console.log(metric_value_id);
          const content = JSON.stringify(data);
          console.log(content);
          const fetchConfig = {
            method: "PUT",
            body: content,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          };
          const response = await fetch(mvUrl, fetchConfig);
          if (response.ok) {
            console.log("put successful");
          }
        } else {
          console.log("failure");
        }
      }
    }
  };

  const handleChange = (e) => {
    const stringToParse = String(e.target.name);
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
    const exists = checkExistence(metricId, exerciseId);
    console.log(exists);
    setExistence(exists);
    console.log(metricID, exerciseID);
    // before setting these states I can check existence

    setMetricValue(e.target.value);
    setMetricId(Number(metricID));
    setExerciseId(Number(exerciseID));
  };

  const checkExistence = (metric_id, exercise_id) => {
    if (workoutdata.metric_values === []) {
      return "_";
    } else {
      for (let value of workoutdata.metric_values) {
        if (
          Number(value.metric_id) === metric_id &&
          Number(value.exercise_id) === exercise_id
        ) {
          console.log(value);
          return String(value);
        }
      }
    }
    return "_";
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
