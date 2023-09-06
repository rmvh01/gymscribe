import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";

function ShowMetricValue(metricID, exerciseID) {
  const metricId = metricID.metricID;
  const exerciseId = metricID.exerciseID;
  const [metricValue, setMetricValue] = useState(0);
  const { workoutId } = useParams();
  const [hasChanged, setHasChanged] = useState(false);
  const { token } = useToken();
  const [newValue, setNewValue] = useState(0);
  const [metricValueId, setMetricValueId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchExistingMetricValue = async () => {
    const metricValues = await fetchMetricValues();
    let foundVal = null;
    if (metricValues.length === undefined) {
      foundVal = null;
    } else {
      for (let value of metricValues) {
        if (value.exercise_id === exerciseId) {
          if (value.metric_id === metricId) {
            foundVal = value;
            setMetricValue((prevMetricValue) => Number(value.value));
            setMetricValueId(foundVal.id);
            setHasChanged(true);
            break;
          }
        }
        if (foundVal === null) {
          setMetricValue((prevMetricValue) => 0);
        }
      }
    }
  };

  useEffect(() => {
    fetchExistingMetricValue();
  }, [hasChanged]);

  const handleChange = (e) => {
    setNewValue(e.target.value);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/metric_values`;
    let data = {
      metric_id: metricId,
      exercise_id: exerciseId,
      value: newValue,
    };
    const content = JSON.stringify(data);
    const fetchConfig = {
      method: "POST",
      body: content,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, fetchConfig);
      if (response.ok) {
        console.log("post successful");
        setHasChanged(true);
      } else {
        console.log("post failure");
      }
    } catch {
      console.log("error caught");
    }
  };

  const handlePut = async (e) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/metric_values/${metricValueId}`;
    let data = {
      metric_id: metricID.metricID,
      exercise_id: metricID.exerciseID,
      value: Number(newValue),
    };
    const content = JSON.stringify(data);
    const fetchConfig = {
      method: "PUT",
      body: content,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await fetch(url, fetchConfig);
      if (response.ok) {
        console.log("put successful");
        setHasChanged(true);
      } else {
        console.log("put failure");
      }
    } catch {
      console.log("error caught");
    }
  };

  const fetchMetricValues = async () => {
    const url = `${process.env.REACT_APP_API_HOST}/api/workouts/${workoutId}`;
    const response = await fetch(url);
    if (response.ok) {
      const json = await response.json();
      return json.metric_values;
    } else {
      console.log("failed to fetch workout data");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchExistingMetricValue();
        setIsLoading(false);
      } catch (error) {
        console.error("error fetching data");
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {!hasChanged ? (
        <>
          <td>
            <h4>Submit a value:</h4>
            <form onSubmit={handlePost}>
              <input type="text" onChange={handleChange} />
              <button type="submit">+</button>
            </form>
          </td>
        </>
      ) : (
        <>
          <td>
            <h4>Current Value: {metricValue}</h4>
            <form onSubmit={handlePut}>
              <input type="text" onChange={handleChange} />
              <button type="submit">+</button>
            </form>
          </td>
        </>
      )}
    </>
  );
}

export default ShowMetricValue;
