from pydantic import BaseModel
from queries.pool import pool


class UserIn(BaseModel):
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True


class AccountOutWithPassword(UserOut):
    hashed_password: str


class UserRepo(BaseModel):
    def user_record_to_dict(self, row, description):
        user = None
        if row is not None:
            user = {}
            user_fields = ["id", "username", "email", "hashed_password"]
            for i, column in enumerate(description):
                if column.name in user_fields:
                    user[column.name] = row[i]
        return AccountOutWithPassword(**user)

    def get_users(self, id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, email, password AS hashed_password
                    FROM users
                    WHERE id = %s
                    ORDER BY id
                    """,
                    [id],
                )
                users = []
                rows = cur.fetchall()
                for row in rows:
                    user = self.user_record_to_dict(row, cur.description)
                    users.append(user)
                return users

    def get_user_by_id(self, id):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, email, password AS hashed_password
                    FROM users
                    WHERE id = %s
                    """,
                    [id],
                )
                row = cur.fetchone()
                return self.user_record_to_dict(row, cur.description)

    def get_user_by_username(self, username):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, email, password AS hashed_password
                    FROM users
                    WHERE username = %s
                    """,
                    [username],
                )
                row = cur.fetchone()
                return self.user_record_to_dict(row, cur.description)

    def create_user(
            self, user: UserIn,
            hashed_password: str
            ) -> AccountOutWithPassword:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO users (username, email, password)
                    VALUES (%s, %s, %s)
                    RETURNING id, username, email, password AS hashed_password;
                    """,
                    [user.username, user.email, hashed_password],
                )
                row = cur.fetchone()
                if row is None:
                    return None
                return AccountOutWithPassword(
                    id=row[0],
                    username=row[1],
                    email=row[2],
                    hashed_password=row[3],
                )

    def delete_user(self, id: int):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    DELETE FROM users
                    WHERE id = %s;
                    """,
                    [id],
                )

    def get_user_by_email(self, email):
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT id, username, email, password AS hashed_password
                    FROM users
                    WHERE email = %s
                    """,
                    [email],
                )
                row = cur.fetchone()
                if row:
                    return self.user_record_to_dict(row, cur.description)
                return None
