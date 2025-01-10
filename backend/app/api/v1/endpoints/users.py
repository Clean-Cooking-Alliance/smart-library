from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Any, List
from ....schemas import UserCreate, User
from ....crud import crud_user
from ....deps import get_db
from ....core import security
from ....schemas.token import Token

router = APIRouter()

@router.post("/", response_model=User)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate
) -> Any:
    """
    Create new user.
    """
    user = crud_user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists."
        )
    return crud_user.create(db, obj_in=user_in)

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login", response_model=Token)
def login(
    *,
    db: Session = Depends(get_db),
    login_request: LoginRequest
) -> Any:
    """
    Login and return an access token.
    """
    user = crud_user.authenticate(db, email=login_request.username, password=login_request.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return {
        "access_token": security.create_access_token(user.id),
        "token_type": "bearer",
    }

@router.get("/", response_model=List[User])
def get_users(
    response: Response,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    order: str = "ASC",
    sort: str = "id"
) -> Any:
    """
    Retrieve all users with pagination.
    """
    users = crud_user.get_multi(db)
    total_count = crud_user.count(db)
    response.headers["X-Total-Count"] = str(total_count)
    return users
