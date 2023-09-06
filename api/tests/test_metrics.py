from fastapi.testclient import TestClient
from main import app
from queries.metrics import MetricRepo
from queries.accounts import UserOut
from authenticator import authenticator

client = TestClient(app)

class FakeMetricRepo:
    def get_metrics(self):
        return [
            {
                "name": "metric name 01",
                "id": 1,
                "workout_id": 1
            },
            {
                "name": "metric name 02",
                "id": 2,
                "workout_id": 1
            },
            {
                "name": "metric name 03",
                "id": 3,
                "workout_id": 1
            },
        ]

def fake_get_current_account_data():
    return UserOut(
        id=1,
        username="test",
        email="test@test.com",
    )

def test_get_metrics():
    app.dependency_overrides[
        authenticator.get_current_account_data
    ] = fake_get_current_account_data
    app.dependency_overrides[MetricRepo] = FakeMetricRepo

    response = client.get("/api/metrics")
    data = response.json()

    assert response.status_code == 200
    assert data == [
        {
            "name": "metric name 01",
            "id": 1,
            "workout_id": 1
        },
        {
            "name": "metric name 02",
            "id": 2,
            "workout_id": 1
        },
        {
            "name": "metric name 03",
            "id": 3,
            "workout_id": 1
        },
    ]
