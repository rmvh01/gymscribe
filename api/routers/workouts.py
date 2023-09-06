from pydantic import BaseModel
from datetime import date
from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from queries.workouts import (
    WorkoutRepo,
    WorkoutIn,
    WorkoutOut,
    WorkoutUpdate
)

from queries.metrics import MetricRepo
from queries.metric_values import MetricValueRepo
from queries.workout_exercises import WorkoutExercisesRepo
from queries.exercise import ExerciseRepo
from authenticator import authenticator
from typing import List


class TotalWorkoutOut(BaseModel):
    id: int
    name: str
    description: str
    date: date
    user_id: int
    metrics: list
    exercises: list
    metric_values: list


router = APIRouter()


@router.post(
    "/api/workouts",
    response_model=WorkoutOut,
    tags=["Workouts"]
)
def create_workout(
    workout: WorkoutIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: WorkoutRepo = Depends(),
):
    return repo.create_workout(
        workout=workout,
        user_id=account_data["id"]
    )


@router.get(
    "/api/workouts",
    response_model=List[WorkoutOut],
    tags=["Workouts"],
)
def get_workout(
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: WorkoutRepo = Depends(),
):
    return repo.get_all_workouts(user_id=account_data["id"])


@router.get(
    "/api/workouts/{workout_id}",
    response_model=TotalWorkoutOut,
    tags=["Workouts"]
)
def get_workout_by_id(
    workout_id: int,
    metric_repo: MetricRepo = Depends(),
    workout_repo: WorkoutRepo = Depends(),
    metric_value_repo: MetricValueRepo = Depends(),
    workout_exercises_repo: WorkoutExercisesRepo = Depends(),
    exercises_repo: ExerciseRepo = Depends(),
):
    '''
    This function uses most of our tables to build an instance
    of a workout with ALL of its data.

    It works by querying each table for the relevant data,
    then that data is formatted according to the response model,
    finally that data is combined with the "complete_workout" dict.
    '''
    # Query workout table, format, then add to new dict
    complete_workout = dict(workout_repo.get_workout_by_id(workout_id))

    metric_names = {
        "metrics":
        [{"id": val["id"], "name": val["name"]}
            for val in metric_repo.get_filtered_metrics(workout_id)]
    }
    complete_workout.update(metric_names)

    # query exercise ids so I can query names using the ids
    exercise_ids = workout_exercises_repo.get_exercises_for_workout(workout_id)
    # query and formatting done here for exercise names
    exercise_names = {
        "exercises":
        [{"name": exercises_repo.get_exercise_by_id(e_id).name, "id": e_id}
            for e_id in exercise_ids]
    }
    complete_workout.update(exercise_names)

    all_values = metric_value_repo.get_all_metric_values()
    metric_ids = [
        val["id"] for val in metric_repo.get_filtered_metrics(workout_id)
    ]
    filtered_by_exercise = [
        v for v in all_values if v.exercise_id in exercise_ids
    ]
    heavily_filtered_values = [
        {
            "id": v.id,
            "value": v.value,
            "exercise_name":
                exercises_repo.get_exercise_by_id(v.exercise_id).name,
            "exercise_id": exercises_repo.get_exercise_by_id(v.exercise_id).id,
            "metric_id": v.metric_id,
        }
        for v in filtered_by_exercise
        if v.metric_id in metric_ids
    ]
    values = {"metric_values": heavily_filtered_values}
    complete_workout.update(values)

    if complete_workout:
        return complete_workout
    else:
        raise HTTPException(status_code=404, detail="Workout not found")


@router.put(
    "/api/workouts/{workout_id}",
    response_model=dict,
    tags=["Workouts"]
)
def update_workout(
    workout_id: int,
    workout: WorkoutUpdate,
    repo: WorkoutRepo = Depends(),
):
    result = repo.update_workout(workout_id, workout)
    if result:
        return {"message": "Successfully update workout!"}
    else:
        raise HTTPException(status_code=500, detail="Failed workout update")
