from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from typing import Optional, List, Dict, Any
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    
    # Relationships
    sessions: List["AnalysisSession"] = Relationship(back_populates="user")
    widgets: List["Widget"] = Relationship(back_populates="user")

class AnalysisSession(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    file_path: str
    file_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    user: Optional[User] = Relationship(back_populates="sessions")

class Widget(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    title: str
    vis_type: str # 'kpi' or 'chart'
    payload: Dict[str, Any] = Field(default={}, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationship
    user: Optional[User] = Relationship(back_populates="widgets")
