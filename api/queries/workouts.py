from pydantic import BaseModel
from typing import List
from queries.pool import pool
from datetime import date
import json


class ExerciseIds(BaseModel):
    exercise_ids: List[int]


class WorkoutIn(BaseModel):
    name: str
    description: str
    exercises: ExerciseIds
    date: date
    user_id: int


class WorkoutOut(WorkoutIn):
    id: int
    name: str
    description: str
    exercises: ExerciseIds
    date: date
    user_id: int


class WorkoutRepo:
    def create_workout(
        self, workout: WorkoutIn
    ):
        exercises_json = json.dumps(workout.exercises.dict())
        with pool.connection() as conn:
            with conn.cursor() as cur:
                result = cur.execute(
                    """
                    INSERT INTO workouts
                        (name,
                        description,
                        exercises,
                        date,
                        user_id
                        )
                    VALUES
                    (%s, %s, %s::jsonb, %s, %s)
                    RETURNING id;
                    """,
                    [
                        workout.name,
                        workout.description,
                        exercises_json,
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
                        SELECT id, name, description, exercises, date, user_id
                        FROM workouts;
                        """,
                    )
                    result = cur.fetchall()
                    workout = [
                        WorkoutOut(
                            id=row[0],
                            name=row[1],
                            description=row[2],
                            exercises=row[3],
                            date=row[4],
                            user_id=row[5],
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
