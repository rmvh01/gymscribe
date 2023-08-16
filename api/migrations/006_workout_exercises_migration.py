steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE workout_exercises (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            workout_id INT REFERENCES workouts(id),
            exercise_id INT REFERENCES exercises(id)
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE workouts;
        """,
    ],
]
