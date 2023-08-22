from fastapi import (
    Depends,
    HTTPException,
    status,
    Response,
    APIRouter,
    Request,
)
from jwtdown_fastapi.authentication import Token
from authenticator import authenticator
from pydantic import BaseModel
from queries.accounts import (
    UserIn,
    UserOut,
    UserRepo,
)


class UserForm(BaseModel):
    username: str
    password: str


class AccountToken(Token):
    user: UserOut


class HttpError(BaseModel):
    detail: str


class DuplicateAccountError(ValueError):
    pass


class UsersList(BaseModel):
    users: list[UserOut]


router = APIRouter()


@router.post(
    "/api/users",
    response_model=AccountToken | HttpError,
    tags=["Users"]
)
async def create_user(
    info: UserIn,
    request: Request,
    response: Response,
    repo: UserRepo = Depends(),
):
    hashed_password = authenticator.hash_password(info.password)
    try:
        account = repo.create_user(info, hashed_password)
    except DuplicateAccountError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot create an account with those credentials",
        )
    form = UserForm(username=info.email, password=info.password)
    token = await authenticator.login(response, request, form, repo)
    return AccountToken(user=account, **token.dict())


@router.get("/api/users", response_model=UsersList, tags=["Users"])
def get_users(
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: UserRepo = Depends(),
):
    return {"users": repo.get_users(account_data.get("id"))}


@router.get("/api/users/{id}", response_model=UserOut, tags=["Users"])
def get_user(
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: UserRepo = Depends(),
):
    user = repo.get_user_by_id(account_data.get("id"))
    if user:
        return user
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.put("/api/users/{id}", response_model=UserOut, tags=["Users"])
def update_user(
    id: int,
    account_data: dict = Depends(authenticator.get_current_account_data),
    repo: UserRepo = Depends(),
):
    if id != account_data.get("id"):
        raise HTTPException(status_code=403, detail="Forbidden")
    existing_user = repo.get_user_by_id(id)
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    updated_user_record = repo.update_user(id,)
    return updated_user_record


@router.delete("/api/users/{id}", response_model=bool, tags=["Users"])
def delete_user(id: int, repo: UserRepo = Depends()):
    repo.delete_user(id)
    return True


@router.post("/api/login", response_model=AccountToken | HttpError)
async def login(
    form: UserForm,
    request: Request,
    response: Response,
    repo: UserRepo = Depends(),
):
    # Fetch user details using the authenticator
    user = await authenticator.get_account_data(form.email, repo)

    if user:
        # Get hashed password using the authenticator
        hashed_password = authenticator.get_hashed_password(user)

        if authenticator.verify_password(form.password, hashed_password):
            token = await authenticator.create_token_for_user(user)
            return AccountToken(user=user, **token.dict())

    # If the user details are not found or password verification fails
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
    )
