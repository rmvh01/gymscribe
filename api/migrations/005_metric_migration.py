steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE metrics (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            values JSONB NOT NULL,
            workout_id INT REFERENCES workouts(id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE metrics;
        """,
    ],
]
