from fastapi.testclient import TestClient
from main import app
from authenticator import authenticator
from queries.workouts import WorkoutRepo, WorkoutIn
from datetime import date

client = TestClient(app)

class WorkoutRepoMock(WorkoutRepo):
    def create_workout(self, user_id, workout: WorkoutIn):
        # Normally, you'd mock database interaction here.
        # For this example, just return a fixed ID and user ID
        return {
            "id": 1,
            "name": workout.name,
            "description": workout.description,
            "date": workout.date,
            "user_id": user_id
        }

def test_create_workout():
    app.dependency_overrides[WorkoutRepo] = WorkoutRepoMock

    user = {"id": 1, "username": "test@example.com"}
    app.dependency_overrides[authenticator.get_current_account_data] = lambda: user

    # Prepare the data to post
    workout_data = {
        "name": "TestWorkout",
        "description": "This is a test workout",
        "date": date.today().isoformat()
    }

    # Send POST request
    response = client.post("/api/workouts", json=workout_data)

    # Validate the response
    assert response.status_code == 200
    assert response.json()["name"] == "TestWorkout"
    assert response.json()["description"] == "This is a test workout"
    assert response.json()["date"] == date.today().isoformat()
    assert response.json()["user_id"] == 1
    assert response.json()["id"] == 1
