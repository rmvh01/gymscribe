from pydantic import BaseModel
from queries.pool import pool


class ExerciseIn(BaseModel):
    name: str
    description: str
    user_id: int


class ExerciseOut(ExerciseIn):
    id: int
    name: str
    description: str
    user_id: int



class ExerciseRepo:
    def create_exercise(
        self, exercise: ExerciseIn
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
                        exercise.user_id,
                    ],
                )
                id = result.fetchone()[0]
                old_data = exercise.dict()
                return ExerciseOut(id=id, **old_data)
