import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";
import "../styles.css";

function EditWorkoutForm() {
  const { token } = useToken();
  const { workout_id } = useParams();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_HOST}/api/workouts/${workout_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setWorkout(data);
        }
      } catch (error) {
        console.error("Failed to fetch workout data:", error);
      }
    };

    fetchData();
  }, [workout_id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workouts/${workout_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(workout),
        }
      );

      if (response.ok) {
        console.log("Workout updated successfully");
        navigate(`/workout/${workout_id}`);
      } else {
        console.error("Failed to update workout");
      }
    } catch (error) {
      console.error("An error occurred while updating the workout:", error);
    }
  };

  if (!token) {
    return <p>Sign up and log in to access the home page.</p>;
  }

  return (
    <div className="container">
      <div className="workout-section">
        <h1 className="text-center mb-3">Edit Existing Workout</h1>
        <form onSubmit={handleSubmit} id="Edit_Workout_Form">
          <div>
            <label>Name Your Workout:</label>
            <input
              type="text"
              value={workout.name}
              onChange={(e) => setWorkout({ ...workout, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>Describe your Workout:</label>
            <textarea
              value={workout.description}
              onChange={(e) =>
                setWorkout({ ...workout, description: e.target.value })
              }
              required
            />
          </div>
          <button type="submit">Update</button>
        </form>
      </div>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default EditWorkoutForm;
