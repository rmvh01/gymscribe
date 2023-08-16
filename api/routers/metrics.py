from fastapi import (
    APIRouter,
    Depends
)
from queries.metrics import MetricRepo, MetricIn

router = APIRouter()


@router.post("/api/metrics", response_model=MetricIn)
def create_metric(
    metric: MetricIn,
    repo: MetricRepo = Depends(),
):
    return repo.create_metric(
        metric
    )
