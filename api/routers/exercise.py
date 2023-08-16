from fastapi import (
    APIRouter,
    Depends
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
