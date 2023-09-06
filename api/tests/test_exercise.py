from fastapi.testclient import TestClient
from main import app
from queries.exercise import ExerciseRepo
from queries.accounts import UserOut
from authenticator import authenticator

client = TestClient(app)


class FakeExerciseRepo:
    def get_all_exercise(self, user_id):
        return [
            {
                "name": "Fake Exercise  1",
                "description": "Description 1",
                "id": 1,
                "user_id": user_id
            },
            {
                "name": "Fake Exercise  2",
                "description": "Description 2",
                "id": 2,
                "user_id": user_id
            },
            {
                "name": "Fake Exercise  3",
                "description": "Description 3",
                "id": 3,
                "user_id": user_id
            },
        ]

    def get_exercise_by_id(self, exercise_id):
        return {
            "name": "Fake Exercise  1",
            "description": "Description 1",
            "id": exercise_id,
            "user_id": 1
        }


def fake_get_current_account_data():
    return UserOut(
        id=1,
        username="test",
        email="test@test.com",
    )


def test_get_all_exercise():
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data
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
