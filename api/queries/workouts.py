from pydantic import BaseModel
from typing import List
from queries.pool import pool
from datetime import date


class ExerciseIds(BaseModel):
    exercise_ids: List[int]


class WorkoutIn(BaseModel):
    name: str
    description: str
    date: date
    user_id: int


class WorkoutOut(WorkoutIn):
    id: int
    name: str
    description: str
    date: date
    user_id: int


class WorkoutRepo:
    def create_workout(
        self, workout: WorkoutIn
    ):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                result = cur.execute(
                    """
                    INSERT INTO workouts
                        (name,
                        description,
                        date,
                        user_id
                        )
                    VALUES
                    (%s, %s, %s, %s)
                    RETURNING id;
                    """,
                    [
                        workout.name,
                        workout.description,
                        workout.date,
                        workout.user_id,
                    ],
                )
                id = result.fetchone()[0]
                old_data = workout.dict()
                return WorkoutOut(id=id, **old_data)

    def get_all_workouts(self):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, name, description, date, user_id
                        FROM workouts;
                        """,
                    )
                    result = cur.fetchall()
                    workout = [
                        WorkoutOut(
                            id=row[0],
                            name=row[1],
                            description=row[2],
                            date=row[3],
                            user_id=row[4],
                        )
                        for row in result
                    ]
                    return workout
        except Exception:
            return {"message": "cannot get all workouts"}

    def delete_workout(self, workout_id: int):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        DELETE FROM workouts
                        WHERE id = %s;
                        """,
                        [workout_id],
                    )
                    return {"message": "Workout deleted successfully!"}
        except Exception:
            return {"message": "Failed to delete workout"}
