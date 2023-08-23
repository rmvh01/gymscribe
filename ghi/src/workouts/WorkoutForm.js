import React, { useState } from "react";
import { Form, Link } from "react-router-dom";
import useToken from "@galvanize-inc/jwtdown-for-react";


function WorkoutForm() {
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
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        const date = new Date()
        const year = String(date.getFullYear())
        const month = Number(date.getMonth()) + 1
        const monthStr = String(month).padStart(2, '0')
        const day = String(date.getDate())
        const formatted_date = `${year}-${monthStr}-${day}`
        formData.append("date", formatted_date)
        const workoutUrl = "http://localhost:8000/api/workout"
        console.log(formData)
        const fetchConfig = {
            method: "POST",
            body: formData,
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
