import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";
import "../styles.css";

function WorkoutForm() {
  const { token } = useToken();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = {};
    let date = new Date();
    let year = String(date.getFullYear());
    let month = Number(date.getMonth()) + 1;
    let monthStr = String(month).padStart(2, "0");
    let day = String(date.getDate());
    let formatted_date = `${year}-${monthStr}-${day}`;
    data.name = title;
    data.description = description;
    data.date = formatted_date;

    const workoutUrl = `${process.env.REACT_APP_API_HOST}/api/workouts`;
    data = JSON.stringify(data);
    const fetchConfig = {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(workoutUrl, fetchConfig);
    if (response.ok) {
      const workout = await response.json();
      const workoutId = workout.id;
      setTitle("");
      setDescription("");
      navigate(`/workout/${workoutId}`);
    }
  };

  return (
    <div className="container">
      <div className="workout-section">
        <h1 className="text-center mb-3">Create a New Workout</h1>
        <form onSubmit={handleSubmit} id="Create_Workout_Form">
          <div>
            <label>Name Your Workout:</label>
            <input type="text" value={title} onChange={handleTitleChange} />
          </div>
          <div>
            <label>Describe your Workout:</label>
            <textarea value={description} onChange={handleDescriptionChange} />
          </div>
          <button type="submit">Create/Select Exercises</button>
        </form>
      </div>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default WorkoutForm;
