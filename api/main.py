from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from authenticator import authenticator
from routers import (
    accounts,
    exercise,
    metrics,
    workouts,
    workout_exercises,
    metric_values
)


app = FastAPI()

app.include_router(authenticator.router)
app.include_router(accounts.router)
app.include_router(exercise.router)
app.include_router(metrics.router)
app.include_router(workouts.router)
app.include_router(workout_exercises.router)
app.include_router(metric_values.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.environ.get("CORS_HOST", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/launch-details")
def launch_details():
    return {
        "launch_details": {
            "module": 3,
            "week": 17,
            "day": 5,
            "hour": 19,
            "min": "00"
        }
    }
