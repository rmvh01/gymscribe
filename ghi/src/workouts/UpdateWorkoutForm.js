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

    // Update the workout data using a PUT or PATCH request
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workouts/${workout_id}`, // Assuming the ID is available in the function scope
        {
          method: "PUT", // Use 'PATCH' if you're doing a partial update
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming the token is available in the function scope
          },
          body: JSON.stringify(workout), // workout is the state variable containing the form data
        }
      );

      if (response.ok) {
        // Successfully updated the workout
        console.log("Workout updated successfully");

        // Navigate back to the list or some other page
        navigate(`/workout/${workout_id}`); // Replace '/workouts' with the actual path you want to navigate to
      } else {
        // Handle errors
        console.error("Failed to update workout");
      }
    } catch (error) {
      // Handle errors
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
