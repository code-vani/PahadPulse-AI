import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, field_validator
import bcrypt
from jose import jwt, JWTError
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.forecast import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ---- Config ----
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-me")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_DAYS = 7

BCRYPT_ROUNDS = 12
security = HTTPBearer()

# Rate limiter (shared instance imported into main.py)
limiter = Limiter(key_func=get_remote_address)


def get_users_collection():
    return get_db()["users"]


# ---- Schemas ----
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---- Helpers ----
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=JWT_EXPIRE_DAYS)
    payload = {"sub": email, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Dependency to protect routes. Use as: def route(user=Depends(get_current_user))"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: Optional[str] = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = get_users_collection().find_one({"email": email})
        if user is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ---- Routes ----
@router.post("/register", status_code=201)
@limiter.limit("5/15minutes")
def register(request: Request, body: RegisterRequest):
    collection = get_users_collection()
    if collection.find_one({"email": body.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    collection.insert_one({
        "email": body.email,
        "password_hash": hash_password(body.password),
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"message": "User registered successfully", "email": body.email}


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/15minutes")
def login(request: Request, body: LoginRequest):
    user = get_users_collection().find_one({"email": body.email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(body.email)
    return TokenResponse(access_token=token)


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return {"email": user["email"], "created_at": user["created_at"]}