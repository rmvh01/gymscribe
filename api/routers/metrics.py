from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from queries.metrics import (
    MetricRepo,
    MetricIn,
    MetricOut,
    MetricUpdate
)
from typing import List
router = APIRouter()


@router.post("/api/metrics", response_model=MetricIn, tags=["Metrics"])
def create_metric(
    metric: MetricIn,
    repo: MetricRepo = Depends(),
):
    return repo.create_metric(
        metric
    )


@router.get("/api/metric", response_model=List[MetricOut], tags=["Metrics"])
def get_metrics(
    repo: MetricRepo = Depends(),
):
    return repo.get_metrics()


@router.get("/api/metric/{metric_id}", response_model=MetricOut, tags=["Metrics"])
def get_metric_by_id(
    metric_id: int,
    repo: MetricRepo = Depends(),
):
    metric = repo.get_metric_by_id(metric_id)
    if metric:
        return metric
    else:
        raise HTTPException(status_code=404, detail="metric not found")


@router.put("/api/metric/{metric_id}", response_model=dict, tags=["Metrics"])
def update_metric_name(
    metric_id: int,
    metric: MetricUpdate,
    repo: MetricRepo = Depends(),
):
    new = repo.update_metric(metric_id, metric)
    if new:
        return new
    else:
        raise HTTPException(
            status_code=404, detail="metric name could not be updated"
        )
