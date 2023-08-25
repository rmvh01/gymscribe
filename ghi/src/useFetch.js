import React, { useState, useEffect } from 'react';

const useFetch = (url, dataName) => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            setData(data[dataName]);
        }
    }

    useEffect(() => {
        fetchData();
    }, [url]);

    return data;
}

export default useFetch;
