from fastapi.testclient import TestClient
from main import app
from queries.exercise import ExerciseRepo, ExerciseOut
from authenticator import authenticator

client = TestClient(app)


class FakeExerciseRepo:
    def get_all_exercise(self):
        return [
            {
                "name": "Fake Exercise  1",
                "description": "Description 1",
                "id": 1,
                "user_id": 1
            },
            {
                "name": "Fake Exercise  2",
                "description": "Description 2",
                "id": 2,
                "user_id": 1
            },
            {
                "name": "Fake Exercise  3",
                "description": "Description 3",
                "id": 3,
                "user_id": 1
            },
        ]

    def get_exercise_by_id(self,exercise_id):
        for exercise in self.get_all_exercise():
            if exercise["id"] == exercise_id:
                return exercise
        return None


def test_get_all_exercise():
    app.dependency_overrides[ExerciseRepo] = FakeExerciseRepo

    response = client.get("/api/exercises")
    data = response.json()

    assert response.status_code == 200
    assert data == [
            {
                "name": "Fake Exercise  1",
                "description": "Description 1",
                "id": 1,
                "user_id": 1
            },
            {
                "name": "Fake Exercise  2",
                "description": "Description 2",
                "id": 2,
                "user_id": 1
            },
            {
                "name": "Fake Exercise  3",
                "description": "Description 3",
                "id": 3,
                "user_id": 1
            },
        ]


def test_get_exercise_detail():
    app.dependency_overrides[ExerciseRepo] = FakeExerciseRepo
    response = client.get("/api/exercises/1")
    data = response.json()
    
    expected_data = {
        "name": "Fake Exercise  1",
        "description": "Description 1",
        "id": 1,
        "user_id": 1
    }
    assert response.status_code == 200
    assert data == expected_data
