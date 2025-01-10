from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from sqlalchemy.sql import func
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100, order: str = "ASC", sort: str = "id"
    ) -> List[User]:
        query = db.query(User)
        if order.upper() == "ASC":
            query = query.order_by(asc(getattr(User, sort)))
        else:
            query = query.order_by(desc(getattr(User, sort)))
        return query.offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            is_superuser=obj_in.is_superuser,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user
    
    def count(
        self,
        db: Session,
    ) -> int:
        query = db.query(func.count(self.model.id))
        return query.scalar()

user = CRUDUser(User)