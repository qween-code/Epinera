from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from app.core.config import get_settings
from app.core.security import create_access_token, decode_access_token

router = APIRouter()
bearer = HTTPBearer(auto_error=False)


class LoginIn(BaseModel):
    username: str
    password: str


class LoginOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=LoginOut)
async def login(payload: LoginIn) -> LoginOut:
    settings = get_settings()
    if payload.username != settings.admin_username or payload.password != settings.admin_password:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Geçersiz kullanıcı adı/parola")
    return LoginOut(access_token=create_access_token(payload.username))


def require_user(creds: HTTPAuthorizationCredentials | None = Depends(bearer)) -> str:
    if not creds:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token gerekli")
    sub = decode_access_token(creds.credentials)
    if not sub:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Token geçersiz / süresi dolmuş")
    return sub


@router.get("/me")
async def me(user: str = Depends(require_user)) -> dict:
    return {"username": user}
