from pydantic import BaseModel
from queries.pool import pool


class Error(BaseModel):
    message: str


class ExerciseIn(BaseModel):
    name: str
    description: str


class ExerciseOut(ExerciseIn):
    id: int
    name: str
    description: str
    user_id: int


class ExerciseUpdate(BaseModel):
    name: str
    description: str


class ExerciseRepo:
    def create_exercise(
        self, user_id, exercise: ExerciseIn
    ):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                result = cur.execute(
                    """
                    INSERT INTO exercises
                        (name,
                        description,
                        user_id)
                    VALUES
                    (%s, %s, %s)
                    RETURNING id;
                    """,
                    [
                        exercise.name,
                        exercise.description,
                        user_id,
                    ],
                )
                id = result.fetchone()[0]
                old_data = exercise.dict()
                return ExerciseOut(id=id, user_id=user_id, **old_data)

    def get_all_exercise(self):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, name, description, user_id
                        FROM exercises;
                        """,
                    )
                    result = cur.fetchall()
                    exercise = [
                        ExerciseOut(
                            id=row[0],
                            name=row[1],
                            description=row[2],
                            user_id=row[3]
                        )
                        for row in result
                    ]
                    return exercise
        except Exception:
            return {"message": "cannot get all exercise"}

    def delete_exercise(self, exercise_id: int):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        DELETE FROM exercises
                        WHERE id = %s;
                        """,
                        [exercise_id],
                    )
                    return {"message": "Exercise deleted successfully!"}
        except Exception:
            return {"message": "Failed to delete exercise"}

    def get_exercise_by_id(self, exercise_id: int):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, name, description, user_id
                        FROM exercises
                        WHERE id = %s;
                        """,
                        [exercise_id]
                    )
                    row = cur.fetchone()
                    if row:
                        return ExerciseOut(
                            id=row[0],
                            name=row[1],
                            description=row[2],
                            user_id=row[3]
                        )
                    else:
                        return None
        except Exception:
            return {"message": "Failed to fetch exercise details"}

    def update_exercise(self, exercise_id: int, exercise: ExerciseUpdate):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE exercises SET
                            name = %s,
                            description = %s
                        WHERE id = %s;
                        """,
                        [
                            exercise.name,
                            exercise.description,
                            exercise_id
                        ],
                    )
                    if cur.rowcount:
                        return {"message": "Exercise updated successfully!"}
                    else:
                        return None
        except Exception:
            return {"message": "Failed to update exercise"}
