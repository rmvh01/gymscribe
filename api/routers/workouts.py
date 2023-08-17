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
from typing import List


router = APIRouter()


@router.post("/api/workout", response_model=WorkoutIn, tags=["Workouts"])
def create_workout(
    workout: WorkoutIn,
    repo: WorkoutRepo = Depends(),
):
    return repo.create_workout(
        workout
    )


@router.get("/api/workout", response_model=List[WorkoutOut], tags=["Workouts"])
def get_workout(
    repo: WorkoutRepo = Depends(),
):
    return repo.get_all_workouts()


@router.delete("/api/workout/{workout_id}", response_model=dict, tags=["Workouts"])
def delete_workout(
    workout_id: int,
    repo: WorkoutRepo = Depends(),
):
    return repo.delete_exercise(
        workout_id
    )


@router.get("/api/workout/{workout_id}", response_model=WorkoutOut, tags=["Workouts"])
def get_workout_by_id(
    workout_id: int,
    repo: WorkoutRepo = Depends(),
):
    workout = repo.get_workout_by_id(workout_id)
    if workout:
        return workout
    else:
        raise HTTPException(status_code=404, detail="Workout not found")


@router.put("/api/workout/{workout_id}", response_model=dict, tags=["Workouts"])
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
