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


class WorkoutOut(WorkoutIn):
    id: int
    name: str
    description: str
    date: date
    user_id: int


class WorkoutUpdate(BaseModel):
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

    def get_workout_by_id(self, workout_id: int):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        '''
                        SELECT id, name, description, date, user_id
                        FROM workouts
                        WHERE id = %s;
                        ''',
                        [workout_id],
                    )
                    row = cur.fetchone()
                    if row:
                        return WorkoutOut(
                            id=row[0],
                            name=row[1],
                            description=row[2],
                            date=row[3],
                            user_id=row[4],
                        )
        except Exception:
            return {"message": "Failed to get workout by ID"}

    def update_workout(self, workout_id: int, workout: WorkoutUpdate):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        '''
                        UPDATE workouts
                        SET name = %s,
                        description = %s,
                        date = %s,
                        user_id = %s
                        WHERE id = %s;
                        ''',
                        [
                            workout.name,
                            workout.description,
                            workout.date,
                            workout.user_id,
                            workout_id,
                        ],
                    )
                    return {"message": "Workout updated successfully!"}
        except Exception:
            return {"message": "Failed update workout"}
