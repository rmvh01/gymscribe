from fastapi.testclient import TestClient
from main import app
from queries.workouts import WorkoutRepo

client = TestClient(app)


class FakeWorkoutRepo:
    def get_all_workouts(self, user_id):
        return [
            {
                "name": "Fake Workout 1",
                "description": "Workout Description 1",
                "id": 1,
                "date": "2021-09-01",
                "user_id": 1
            },
            {
                "name": "Fake Workout 2",
                "description": "Workout Description 2",
                "id": 2,
                "date": "2021-09-02",
                "user_id": 1
            },
        ]

    def get_workout_by_id(self, workout_id):
        for workout in self.get_all_workouts(1):
            if workout["id"] == workout_id:
                return workout
        return None


# Test cases for Workout
def test_get_all_workouts():
    app.dependency_overrides[WorkoutRepo] = FakeWorkoutRepo

    response = client.get("/api/workouts")
    data = response.json()

    assert response.status_code == 200
    assert data == [
        {
            "name": "Fake Workout 1",
            "description": "Workout Description 1",
            "id": 1,
            "date": "2021-09-01",
            "user_id": 1
        },
        {
            "name": "Fake Workout 2",
            "description": "Workout Description 2",
            "id": 2,
            "date": "2021-09-02",
            "user_id": 1
        },
    ]


def test_get_workout_detail():
    app.dependency_overrides[WorkoutRepo] = FakeWorkoutRepo

    response = client.get("/api/workouts/1")
    data = response.json()

    assert response.status_code == 200
    assert data == {
        "name": "Fake Workout 1",
        "description": "Workout Description 1",
        "id": 1,
        "date": "2021-09-01",
        "user_id": 1
    }
