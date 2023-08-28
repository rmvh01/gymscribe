from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from queries.exercise import (
    ExerciseRepo, ExerciseIn, ExerciseOut, ExerciseUpdate, Error
)
from typing import List, Union
from authenticator import authenticator


router = APIRouter()


@router.post(
        "/api/exercises",
        response_model=ExerciseIn,
        tags=["Exercises"]
)
def create_exercise(
    exercise: ExerciseIn,
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: ExerciseRepo = Depends(),
):
    return repo.create_exercise(
        exercise=exercise,
        user_id=account_data["id"]
    )


@router.get(
    "/api/exercises",
    response_model=Union[List[ExerciseOut], Error],
    tags=["Exercises"]
)
def get_exercise(
    repo: ExerciseRepo = Depends(),
):
    return repo.get_all_exercise()


@router.delete(
    "/api/exercises/{exercise_id}",
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
    "/api/exercises/{exercise_id}",
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
    "/api/exercises/{exercise_id}",
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
