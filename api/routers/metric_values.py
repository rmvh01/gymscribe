from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from typing import List
from queries.metric_values import (
    MetricValueRepo,
    MetricValueIn,
    MetricValueOut
)
router = APIRouter()


@router.post(
    "/api/metric_values",
    response_model=MetricValueOut,
    tags=["Metric Values"]
)
def create_metric_value(
    metric_value: MetricValueIn,
    repo: MetricValueRepo = Depends(),
):
    return repo.create_metric_value(
        metric_value
    )


@router.get(
    "/api/metric_values",
    response_model=List[MetricValueOut],
    tags=["Metric Values"]
)
def get_all_metric_values(
    repo: MetricValueRepo = Depends(),
):
    return repo.get_all_metric_values()


@router.get(
    "/api/metric_values/{metric_value_id}",
    response_model=MetricValueOut,
    tags=["Metric Values"]
)
def get_metric_value_by_id(
    metric_value_id: int,
    repo: MetricValueRepo = Depends(),
):
    metric_value = repo.get_metric_value_by_id(metric_value_id)
    if metric_value:
        return metric_value
    else:
        raise HTTPException(status_code=404, detail="Metric value not found")


@router.put(
    "/api/metric_values/{metric_value_id}",
    response_model=dict,
    tags=["Metric Values"]
)
def update_metric_value_data(
    metric_value_id: int,
    metric_value: MetricValueIn,
    repo: MetricValueRepo = Depends(),
):
    new = repo.update_metric_value(metric_value_id, metric_value)
    if new:
        return new
    else:
        raise HTTPException(
            status_code=404, detail="Cannot update metric value data"
        )


@router.delete(
    "/api/metric_values/{metric_value_id}",
    tags=["Metric Values"]
)
def delete_metric_value(
    metric_value_id: int,
    repo: MetricValueRepo = Depends(),
):
    return repo.delete_metric_value(metric_value_id)
