from fastapi import (
    APIRouter,
)
from pydantic import BaseModel
from queries.exercise import ExerciseRepo

router = APIRouter()


class Exercise(BaseModel):
    name: str
    description: str
    user_id: int


@router.post("/api/exercise", response_model=Exercise)
def create_exercise(
    repo: ExerciseRepo, exercise: Exercise
):
    pass
