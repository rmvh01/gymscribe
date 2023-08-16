from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from queries.exercise import ExerciseRepo, ExerciseIn, ExerciseOut
from typing import List


router = APIRouter()


@router.post("/api/exercise", response_model=ExerciseIn)
def create_exercise(
    exercise: ExerciseIn,
    repo: ExerciseRepo = Depends(),
):
    return repo.create_exercise(
        exercise
    )


@router.get("/api/exercise", response_model=List[ExerciseOut])
def get_exercise(
    repo: ExerciseRepo = Depends(),
):
    return repo.get_all_exercise()


@router.delete("/api/exercise/{exercise_id}", response_model=dict)
def delete_exercise(
    exercise_id: int,
    repo: ExerciseRepo = Depends(),
):
    return repo.delete_exercise(
        exercise_id
    )


@router.get("/api/exercise/{exercise_id}", response_model=ExerciseOut)
def get_exercise_detail(
    exercise_id: int,
    repo: ExerciseRepo = Depends(),
):
    exercise = repo.get_exercise_by_id(exercise_id)
    if exercise:
        return exercise
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")
