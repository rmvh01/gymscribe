from pydantic import BaseModel
from queries.pool import pool


class WorkoutExerciseIn(BaseModel):
    workout_id: int
    exercise_id: int


class WorkoutExerciseOut(WorkoutExerciseIn):
    id: int


class WorkoutExercisesRepo:

    def add_exercise_to_workout(
            self,
            workout_exercise: WorkoutExerciseIn
    ):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                result = cur.execute(
                    """
                    INSERT INTO workout_exercises
                        (workout_id,
                        exercise_id)
                    VALUES
                    (%s, %s)
                    RETURNING id;
                    """,
                    [
                        workout_exercise.workout_id,
                        workout_exercise.exercise_id,
                    ],
                )
                id = result.fetchone()[0]
                return WorkoutExerciseOut(
                    id=id,
                    **workout_exercise.dict()
                )

    def get_exercises_for_workout(self, workout_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT exercise_id
                    FROM workout_exercises
                    WHERE workout_id = %s;
                    """,
                    [workout_id],
                )
                return [row[0] for row in cur.fetchall()]

    def remove_exercise_from_workout(self, exercise_id: int, workout_id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM workout_exercises
                    WHERE workout_id = %s AND exercise_id = %s;
                    """,
                    [exercise_id, workout_id]
                )
                return (
                    {"message": "Exercise removed from workout successfully!"}
                )
