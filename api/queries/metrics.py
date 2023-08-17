from pydantic import BaseModel
from queries.pool import pool


class MetricIn(BaseModel):
    name: str
    workout_id: int


class MetricOut(MetricIn):
    id: int
    name: str
    workout_id: int


class MetricUpdate(MetricIn):
    name: str


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
                        workout_id
                        )
                    VALUES
                    (%s, %s)
                    RETURNING id;
                    """,
                    [
                        metric.name,
                        metric.workout_id,
                    ],
                )
                id = result.fetchone()[0]
                old_data = metric.dict()
                return MetricOut(id=id, **old_data)

    def get_metrics(self):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, name, workout_id
                        FROM metrics;
                        """,
                    )
                    result = cur.fetchall()
                    workout = [
                        MetricOut(
                            id=row[0],
                            name=row[1],
                            workout_id=row[2],
                        )
                        for row in result
                    ]
                    return workout
        except Exception:
            return {"message": "cannot get all metrics"}

    def get_metric_by_id(
            self, metric_id: int
    ):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, name, workout_id
                        FROM metrics
                        WHERE id = %s;
                        """,
                        [metric_id]
                    )
                    row = cur.fetchone()
                    if row:
                        return MetricOut(
                            id=row[0],
                            name=row[1],
                            workout_id=row[2]
                        )
                    else:
                        return None
        except Exception:
            return {"message: ": "failed to fetch metric details"}

    def update_metric(self, metric_id: int, metric: MetricUpdate):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE metrics SET
                            name = %s
                        """,
                        [metric.name],
                    )
                    if cur.rowcount:
                        return {"message": "metric updated successfully"}
                    else:
                        return None
        except Exception:
            return {"message": "failed to update metric name"}
