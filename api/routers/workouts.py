from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from queries.workouts import WorkoutRepo, WorkoutIn, WorkoutOut
from typing import List


router = APIRouter()


@router.post("/api/workout", response_model=WorkoutIn)
def create_workout(
    workout: WorkoutIn,
    repo: WorkoutRepo = Depends(),
):
    return repo.create_workout(
        workout
    )


@router.get("/api/workout", response_model=List[WorkoutOut])
def get_workout(
    repo: WorkoutRepo = Depends(),
):
    return repo.get_all_workouts()


@router.delete("/api/workout/{workout_id}", response_model=dict)
def delete_workout(
    workout_id: int,
    repo: WorkoutRepo = Depends(),
):
    return repo.delete_exercise(
        workout_id
    )


@router.get("/api/workout/{workout_id}", response_model=WorkoutOut)
def get_workout_by_id(
    workout_id: int,
    repo: WorkoutRepo = Depends(),
):
    workout = repo.get_workout_by_id(workout_id)
    if workout:
        return workout
    else:
        raise HTTPException(status_code=404, detail="Workout not found")
