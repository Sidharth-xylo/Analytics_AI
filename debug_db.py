from sqlmodel import SQLModel, Session, select
from backend.database import engine
from backend.models import User, AnalysisSession
from backend.auth import get_password_hash

def debug_setup():
    print("Creating tables...")
    SQLModel.metadata.create_all(engine)
    print("Tables created.")
    
    with Session(engine) as session:
        email = "debug@example.com"
        print(f"Checking for {email}...")
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            print("Creating debug user...")
            pwd = get_password_hash("password")
            user = User(email=email, password_hash=pwd)
            session.add(user)
            session.commit()
            print(f"User created: {user.email} (ID: {user.id})")
        else:
            print("Debug user already exists.")
            
if __name__ == "__main__":
    debug_setup()
