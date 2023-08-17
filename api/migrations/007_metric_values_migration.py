steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE metric_values (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            metric_id INT REFERENCES metrics(id),
            value INT NOT NULL,
            exercise_id INT REFERENCES exercises(id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE metric_values;
        """,
    ],
]
