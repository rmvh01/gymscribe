steps = [
    [
        # "Up" SQL statement
        """
        CREATE TABLE metrics (
            id SERIAL NOT NULL UNIQUE PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            value INT NOT NULL
        );
        """,
        # "Down" SQL statement
        """
        DROP TABLE metrics;
        """,
    ],
]
