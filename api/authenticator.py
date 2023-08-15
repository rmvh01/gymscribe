import os
from fastapi import Depends
from jwtdown_fastapi.authentication import Authenticator
from queries.accounts import UserRepo, UserOut, AccountOutWithPassword


class GymScribeAuthenticator(Authenticator):
    async def get_account_data(
        self,
        email: str,
        users: UserRepo,
    ):
        return users.get_user_by_email(email)

    def get_account_getter(
        self,
        users: UserRepo = Depends(),
    ):
        return users

    def get_hashed_password(self, user: AccountOutWithPassword):
        return user.hashed_password

    def get_account_data_for_cookie(self, user: AccountOutWithPassword):
        return user.email, UserOut(**user.dict())


authenticator = GymScribeAuthenticator(os.environ["SIGNING_KEY"])
