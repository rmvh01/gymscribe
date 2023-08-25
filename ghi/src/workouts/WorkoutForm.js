import React, { useState } from "react";
import { Form, Link, useParams } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";

function WorkoutForm() {
    const { workout_id } = useParams();
    const { token } = useToken();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = {}
        let date = new Date()
        let year = String(date.getFullYear())
        let month = Number(date.getMonth()) + 1
        let monthStr = String(month).padStart(2, '0')
        let day = String(date.getDate())
        let formatted_date = `${year}-${monthStr}-${day}`
        data.name = title
        data.description = description
        data.date = formatted_date
        console.log(data)
        const workoutUrl = "http://localhost:8000/api/workout/"
        data = JSON.stringify(data)
        const fetchConfig = {
            method: "POST",
            body: data,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        };
        const response = await fetch(
            workoutUrl, fetchConfig
        );
        if (response.ok) {
            setTitle('');
            setDescription('');
            console.log("Workout Created Successfully");
        }
        else {console.log("Workout could not be post")}
    };

    return (
        <div>
            <form onSubmit={handleSubmit} id="Create Workout Form">
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
    );
};
export default WorkoutForm;
