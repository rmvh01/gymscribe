import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react"; // Uncomment if you use this

function WorkoutListView() {
  const { token } = useToken();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);

  // Fetch workout data
  const fetchData = async () => {
    try {
      const workoutDetailResponse = await fetch(
        `${process.env.REACT_APP_API_HOST}/api/workout`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (workoutDetailResponse.ok) {
        const workoutDetailJson = await workoutDetailResponse.json();
        setWorkouts(workoutDetailJson);
      }
    } catch {
      console.log("failed to fetch workout details");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container">
      <h1>Workout List</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout) => (
            <tr key={workout.id}>
              <td>{workout.name}</td>
              <td>{workout.description}</td>
              <td>
                <button onClick={() => navigate(`/workoutform/${workout.id}`)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default WorkoutListView;
