steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE exercises (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            user_id INT REFERENCES users(id) ON DELETE CASCADE
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE exercises;
        """,
    ],
]
