from fastapi import (
    APIRouter,
    Depends
)
from pydantic import BaseModel
from queries.exercise import ExerciseRepo, ExerciseIn


router = APIRouter()


@router.post("/api/exercise", response_model=ExerciseIn)
def create_exercise(
    exercise: ExerciseIn,
    repo: ExerciseRepo = Depends(),
):
    return repo.create_exercise(
        exercise
    )
