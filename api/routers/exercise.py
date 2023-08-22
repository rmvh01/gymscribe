from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from queries.exercise import (
    ExerciseRepo, ExerciseIn, ExerciseOut, ExerciseUpdate, Error
)
from typing import List, Union


router = APIRouter()


@router.post(
        "/api/exercise",
        response_model=ExerciseIn,
        tags=["Exercises"]
)
def create_exercise(
    exercise: ExerciseIn,
    repo: ExerciseRepo = Depends(),
):
    return repo.create_exercise(
        exercise
    )


@router.get(
    "/api/exercise",
    response_model=Union[List[ExerciseOut], Error],
    tags=["Exercises"]
)
def get_exercise(
    repo: ExerciseRepo = Depends(),
):
    return repo.get_all_exercise()


@router.delete(
    "/api/exercise/{exercise_id}",
    response_model=dict,
    tags=["Exercises"]
)
def delete_exercise(
    exercise_id: int,
    repo: ExerciseRepo = Depends(),
):
    return repo.delete_exercise(
        exercise_id
    )


@router.get(
    "/api/exercise/{exercise_id}",
    response_model=ExerciseOut,
    tags=["Exercises"]
)
def get_exercise_detail(
    exercise_id: int,
    repo: ExerciseRepo = Depends(),
):
    exercise = repo.get_exercise_by_id(exercise_id)
    if exercise:
        return exercise
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")


@router.put(
    "/api/exercise/{exercise_id}",
    response_model=dict,
    tags=["Exercises"]
)
def update_exercise(
    exercise_id: int,
    exercise: ExerciseUpdate,
    repo: ExerciseRepo = Depends(),
):
    result = repo.update_exercise(exercise_id, exercise)
    if result:
        return result
    else:
        raise HTTPException(
            status_code=404, detail="Exercise not found or update failed"
            )
