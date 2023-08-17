steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE workouts (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            description TEXT NOT NULL,
            date DATE NOT NULL,
            user_id INT REFERENCES users(id) ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE workouts;
        """,
    ],
]
