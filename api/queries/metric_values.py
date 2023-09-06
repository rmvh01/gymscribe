from pydantic import BaseModel
from queries.pool import pool


class MetricValueIn(BaseModel):
    metric_id: int
    value: int
    exercise_id: int


class MetricValueOut(MetricValueIn):
    id: int


class MetricValueRepo:
    def create_metric_value(self, metric_value: MetricValueIn):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO metric_values
                        (metric_id,
                        value,
                        exercise_id
                        )
                    VALUES
                    (%s, %s, %s)
                    RETURNING id;
                    """,
                    [
                        metric_value.metric_id,
                        metric_value.value,
                        metric_value.exercise_id,
                    ],
                )
                id = cur.fetchone()[0]
                old_data = metric_value.dict()
                return MetricValueOut(id=id, **old_data)

    def get_all_metric_values(self):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, metric_id, value, exercise_id
                        FROM metric_values;
                        """,
                    )
                    result = cur.fetchall()
                    metric_values = [
                        MetricValueOut(
                            id=row[0],
                            metric_id=row[1],
                            value=row[2],
                            exercise_id=row[3],
                        )
                        for row in result
                    ]
                    return metric_values
        except Exception:
            return {"message": "cannot get all metric values"}


    def get_metric_value_by_id(self, metric_value_id: int):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        SELECT id, metric_id, value, exercise_id
                        FROM metric_values
                        WHERE id = %s;
                        """,
                        [metric_value_id],
                    )
                    row = cur.fetchone()
                    if row:
                        return MetricValueOut(
                            id=row[0],
                            metric_id=row[1],
                            value=row[2],
                            exercise_id=row[3],
                        )
        except Exception:
            return {"message": "Failed to get metric value by ID"}

    def update_metric_value(
            self,
            metric_value_id: int,
            metric_value: MetricValueIn
    ):
        try:
            with pool.connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """
                        UPDATE metric_values
                        SET metric_id = %s,
                        value = %s,
                        exercise_id = %s
                        WHERE id = %s;
                        """,
                        [
                            metric_value.metric_id,
                            metric_value.value,
                            metric_value.exercise_id,
                            metric_value_id,
                        ],
                    )
                    return {"message": "Metric value updated successfully!"}
        except Exception:
            return {"message": "Failed update metric value"}
