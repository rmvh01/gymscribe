import React, { useState, useEffect } from "react";
import useToken from "@galvanize-inc/jwtdown-for-react";
import { useNavigate} from 'react-router-dom';


function CreateExercise() {
    const { token } = useToken();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = {};
        data.name = name;
        data.description = description;
        const Url = `${process.env.REACT_APP_API_HOST}/api/exercises`;
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
            setDescription("");
            console.log("Exercises posted")
        } else {
            console.log("Exercise did not post")
        }
    };

    return (
    <div>
        <form onSubmit={handleSubmit} id="Create Workout Form">
            <div>
                <label>Name your exercise:</label>
                <input type="text" value={name} onChange={handleNameChange} />
            </div>
            <div>
                <label>Describe your exercise:</label>
                <textarea value={description} onChange={handleDescriptionChange} />
            </div>
            <button type="submit">Create Exercise</button>
        </form>
        <button onClick={()=>navigate(-1)}>Back to Workout</button>
    </div>
    )
}

export default CreateExercise;
