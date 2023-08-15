from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from pydantic import BaseModel

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
