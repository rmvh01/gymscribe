steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE workout_exercises (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
            exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE workout_exercises;
        """,
    ],
]
