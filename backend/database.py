from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os

# Create the database in the backend directory
sqlite_file_name = "database_v2.db"
# Use absolute path for reliability in dev environment
base_dir = os.path.dirname(os.path.abspath(__file__))
sqlite_url = f"sqlite:///{os.path.join(base_dir, sqlite_file_name)}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
