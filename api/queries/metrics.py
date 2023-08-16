from pydantic import BaseModel
from queries.pool import pool


class MetricIn(BaseModel):
    name: str
    value: int


class MetricOut(MetricIn):
    id: int
    name: str
    value: int


class MetricRepo:
    def create_metric(
        self, metric: MetricIn
    ):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                result = cur.execute(
                    """
                    INSERT INTO metrics
                        (name,
                        value
                        )
                    VALUES
                    (%s, %s)
                    RETURNING id;
                    """,
                    [
                        metric.name,
                        metric.value,
                    ],
                )
                id = result.fetchone()[0]
                old_data = metric.dict()
                return MetricOut(id=id, **old_data)
