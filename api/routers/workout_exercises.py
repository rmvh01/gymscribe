from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from queries.workout_exercises import (
    WorkoutExercisesRepo, WorkoutExerciseIn, WorkoutExerciseOut
)
from typing import List

router = APIRouter()


@router.post("/api/workout_exercise", response_model=WorkoutExerciseOut, tags=["Workout Exercises"])
def add_exercise_to_workout(
    workout_exercise: WorkoutExerciseIn,
    repo: WorkoutExercisesRepo = Depends(),
):
    result = repo.add_exercise_to_workout(workout_exercise)
    if result:
        return result
    else:
        raise HTTPException(
            status_code=400, detail="Failed to add exercise to workout."
        )


@router.get("/api/workout/{workout_id}/exercises", response_model=List[int], tags=["Workout Exercises"])
def get_exercises_for_workout(
    workout_id: int,
    repo: WorkoutExercisesRepo = Depends(),
):
    exercises = repo.get_exercises_for_workout(workout_id)
    if exercises:
        return exercises
    else:
        raise HTTPException(
            status_code=404,
            detail="Workout not found or no exercises associated."
        )


@router.delete("/api/workout_exercise/{id}", response_model=dict, tags=["Workout Exercises"])
def remove_exercise_from_workout(
    id: int,
    repo: WorkoutExercisesRepo = Depends(),
):
    result = repo.remove_exercise_from_workout(id)
    if result:
        return result
    else:
        raise HTTPException(
            status_code=404, detail="Workout-exercise association not found."
        )
