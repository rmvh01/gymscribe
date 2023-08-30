import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

function ShowOneWorkout() {
  const { workout_id } = useParams();
  const [workoutdata, setWorkoutData] = useState({});
  const navigate = useNavigate();

  const fetchData = async () => {
    const newWorkoutId = parseInt(workout_id);
    const url = `${process.env.REACT_APP_API_HOST}/api/workout/${workout_id}`;
    const response = await fetch(url);
    const json = await response.json();
    setWorkoutData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>{workoutdata.name}</h1>
      <p>{workoutdata.description}</p>
      <p>Date: {workoutdata.date}</p>
      <Link to={`/workoutform/${workout_id}`}>Edit Workout</Link>
      <button onClick={() => navigate(`/workout/${workout_id}/exercises`)}>
        View Exercises
      </button>
    </div>
  );
}

export default ShowOneWorkout;
