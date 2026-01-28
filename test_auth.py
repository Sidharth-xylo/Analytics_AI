import requests
from sqlmodel import Session, select, create_engine
from backend.models import User, AnalysisSession

BASE_URL = "http://127.0.0.1:8005"

def test_auth_flow():
    # 1. Register
    email = "test@example.com"
    password = "securepassword"
    print(f"Registering user: {email}")
    
    try:
        res = requests.post(f"{BASE_URL}/register", json={"email": email, "password": password})
        if res.status_code == 200:
            print("✅ Register Success")
        elif res.status_code == 400 and "already registered" in res.text:
             print("ℹ️ User already exists, proceeding to login.")
        else:
            print(f"❌ Register Failed: {res.text}")
            return
            
        # 2. Login
        print("Logging in...")
        res = requests.post(f"{BASE_URL}/login", data={"username": email, "password": password})
        if res.status_code == 200:
            token = res.json()["access_token"]
            print(f"✅ Login Success. Token: {token[:10]}...")
        else:
            print(f"❌ Login Failed: {res.text}")
            return

        # 3. Upload File (Protected)
        print("Uploading file with Token...")
        files = {'file': ('test.csv', 'col1,col2\n1,2', 'text/csv')}
        headers = {'Authorization': f'Bearer {token}'}
        
        res = requests.post(f"{BASE_URL}/upload", files=files, headers=headers)
        if res.status_code == 200:
            print("✅ Upload Success")
        else:
            print(f"❌ Upload Failed: {res.text}")
            return

        # 4. Verify DB Record
        print("Verifying Database Record...")
        # Connect to DB directly to check
        sqlite_url = "sqlite:///backend/database.db"
        engine = create_engine(sqlite_url)
        with Session(engine) as session:
            user = session.exec(select(User).where(User.email == email)).first()
            if user:
                print(f"User Found: ID {user.id}")
                sessions = session.exec(select(AnalysisSession).where(AnalysisSession.user_id == user.id)).all()
                print(f"Analysis Sessions found: {len(sessions)}")
                if len(sessions) > 0:
                    print("✅ Database Verification Success")
                else:
                    print("❌ No session recorded in DB")
            else:
                print("❌ User not found in DB")

    except Exception as e:
        print(f"❌ Test Exception: {e}")

if __name__ == "__main__":
    test_auth_flow()
