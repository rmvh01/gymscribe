import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";

function ShowOneWorkout() {
  const { workout_id } = useParams();
  const [workoutdata, setWorkoutData] = useState({});

  const fetchData = async () => {
    const newWorkoutId = parseInt(workout_id);
    const url = `${process.env.REACT_APP_API_HOST}/workout/${workout_id}`;
    const response = await fetch(url);
    const json = await response.json();
    console.log(json);
  };

  useEffect(() => {
    fetchData();
  }, []);
}
export default ShowOneWorkout;
