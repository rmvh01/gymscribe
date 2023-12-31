import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ShowMetricValue from "./ShowMetricValue";
import useToken from "@galvanize-inc/jwtdown-for-react";

function DetailWorkout() {
  const { token } = useToken();
  const { workoutId } = useParams();
  const [workoutData, setWorkoutData] = useState({});

  const fetchWorkout = async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/workouts/${workoutId}`;
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      setWorkoutData(json);
    } else {
      console.log("fetch failed");
    }
  };

  useEffect(() => {
    fetchWorkout();
  }, [workoutId]);

  if (!token) {
    return <p>Sign up and log in to access the home page.</p>;
  }

  return (
    <div className="workout-container">
      {workoutData.name && (
        <>
          <h1>Workout Name: {workoutData.name}</h1>
          <h2>Workout Description: {workoutData.description}</h2>
          <h3>{workoutData.date}</h3>
          <table>
            <thead>
              <tr>
                <th></th>
                {workoutData.metrics.map((metric) => (
                  <th key={metric.id}>{metric.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workoutData.exercises.map((exercise) => (
                <tr key={`${exercise.id}_exercises_map`}>
                  <th>{exercise.name}</th>
                  {workoutData.metrics.map((metric) => (
                    <ShowMetricValue
                      key={`${exercise.id}_${metric.id}`}
                      exerciseID={exercise.id}
                      metricID={metric.id}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default DetailWorkout;
