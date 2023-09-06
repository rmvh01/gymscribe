from fastapi.testclient import TestClient
from main import app
from queries.exercise import ExerciseRepo, ExerciseOut
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

    def create_exercise(self, user_id, exercise):
        return ExerciseOut(
            id=999,
            name=exercise.name,
            description=exercise.description,
            user_id=user_id
        )

    def delete_exercise(self, exercise_id: int):
        if exercise_id == 1:
            return {"message": "Exercise deleted successfully!"}
        else:
            return {"message": "Failed to delete exercise"}


def fake_get_current_account_data():
    return UserOut(
        id=1,
        username="test",
        email="test@test.com",
    )


def unwrap_user_out():
    user = fake_get_current_account_data()
    return {"id": user.id, "username": user.username, "email": user.email}


def test_get_all_exercise():
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = unwrap_user_out
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


def test_create_exercise():
    app.dependency_overrides[ExerciseRepo] = FakeExerciseRepo

    app.dependency_overrides[
        authenticator.get_current_account_data
        ] = unwrap_user_out

    new_exercise = {
        "name": "New Fake Exercise",
        "description": "New Description",
    }

    response = client.post("/api/exercises", json=new_exercise)
    data = response.json()

    assert response.status_code == 200
    assert data["name"] == new_exercise["name"]
    assert data["description"] == new_exercise["description"]


def test_delete_exercise():
    app.dependency_overrides[ExerciseRepo] = FakeExerciseRepo

    response = client.delete("/api/exercises/1")
    data = response.json()

    assert response.status_code == 200
    assert data == {"message": "Exercise deleted successfully!"}

    response_fail = client.delete("/api/exercises/1000")
    data_fail = response_fail.json()

    assert response_fail.status_code == 200
    assert data_fail == {"message": "Failed to delete exercise"}
