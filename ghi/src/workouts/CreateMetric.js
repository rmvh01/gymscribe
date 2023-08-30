import React, { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate, useParams } from "react-router-dom";

function CreateMetric() {
  const { token } = useToken();
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { workout_id } = useParams();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newWorkoutID = parseInt(workout_id);
    let data = {
      workout_id: newWorkoutID,
      name: name,
    };
    const Url = `${process.env.REACT_APP_API_HOST}/api/metrics`;
    data = JSON.stringify(data);

    const fetchConfig = {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(Url, fetchConfig);
    if (response.ok) {
      setName("");
      console.log("Metrics posted");
    } else {
      console.log("Metrics did not post");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id="Create Metric Form">
        <div>
          <label>Name your metric:</label>
          <input type="text" value={name} onChange={handleNameChange} />
        </div>
        <button type="submit">Create Metric</button>
      </form>
      <button onClick={() => navigate(`/workout/${workout_id}/view`)}>
        Finalize Workout
      </button>
    </div>
  );
}

export default CreateMetric;
