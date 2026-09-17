from typing import Any, Union
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.deps import get_current_user
from app.models.user import User
from app.models.department import Department
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token

router = APIRouter()

def build_user_response(user: User, db: Session) -> UserResponse:
    dept_name = None
    if user.department_id:
        dept = db.query(Department).filter(Department.id == user.department_id).first()
        if dept:
            dept_name = dept.name
    return UserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        role=user.role,
        department_id=user.department_id,
        department_name=dept_name,
        is_active=user.is_active,
        created_at=user.created_at,
    )

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    # Check if user with email already exists
    existing_user = db.query(User).filter(User.email == user_in.email.lower().strip()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address is already registered."
        )

    # Security: Default public registration to citizen role
    role = "citizen"
    if user_in.role in ["citizen", "staff", "admin"]:
        # Allow demo creation if specified or citizen
        role = user_in.role

    new_user = User(
        name=user_in.name.strip(),
        email=user_in.email.lower().strip(),
        phone=user_in.phone.strip() if user_in.phone else None,
        password_hash=get_password_hash(user_in.password),
        role=role,
        department_id=user_in.department_id if role == "staff" else None,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    user_resp = build_user_response(new_user, db)
    access_token = create_access_token(subject=new_user.id, role=new_user.role)
    return Token(access_token=access_token, token_type="bearer", user=user_resp)

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    db: Session = Depends(get_db)
) -> Any:
    email = None
    password = None

    # Support both JSON and application/x-www-form-urlencoded
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        body = await request.json()
        email = body.get("email") or body.get("username")
        password = body.get("password")
    else:
        form = await request.form()
        email = form.get("username") or form.get("email")
        password = form.get("password")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email/username and password are required."
        )

    user = db.query(User).filter(User.email == str(email).lower().strip()).first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated. Please contact administrator."
        )

    user_resp = build_user_response(user, db)
    access_token = create_access_token(subject=user.id, role=user.role)
    return Token(access_token=access_token, token_type="bearer", user=user_resp)

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Any:
    return build_user_response(current_user, db)
