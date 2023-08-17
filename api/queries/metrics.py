from pydantic import BaseModel
from queries.pool import pool


class MetricIn(BaseModel):
    name: str
    workout_id: int


class MetricOut(MetricIn):
    id: int
    name: str
    workout_id: int


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

    def get_metrics(
            self, metric: MetricIn
    ):
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
