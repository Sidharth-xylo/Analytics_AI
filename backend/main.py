from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from pandasai import SmartDataframe
from pandasai_openai import OpenAI
import os
from dotenv import load_dotenv
import json
import re
import ast
import requests
import shutil
import tempfile
import time
import uuid
from io import StringIO
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select, Session
from typing import Dict, Any, List
import numpy as np
import math

# --- INTERNAL MODULES ---
from backend.database import engine, get_session
from backend.models import User, AnalysisSession, Widget
from backend.auth import get_password_hash, verify_password, create_access_token, get_current_user

# --- CONFIGURATION ---
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path, override=True)

app = FastAPI()

# --- SESSION HELPER ---
def get_session_user_id(request: Request) -> int:
    """
    Extracts session ID from request headers and converts to integer user ID
    """
    session_id = request.headers.get("X-Session-ID", "default-session")
    
    # Convert UUID string to consistent integer hash
    # This allows us to use session IDs as user_id in the database
    user_id = abs(hash(session_id)) % (10**8)  # Keep it within reasonable integer range
    
    return user_id

# --- WARMUP HELPER ---
def warmup_agent(user_id: int, file_id: str):
    """Initializes the SmartDataframe and runs a dummy query to warm up the LLM."""
    print(f"🔥 Warming up agent for User {user_id}, File {file_id}...")
    try:
        session_data = get_user_session(user_id)
        if file_id in session_data["files"]:
            file_info = session_data["files"][file_id]
            
            # 1. Initialize DF if needed
            if file_info.get("df") is None:
                 if file_info.get("path"):
                    if file_info["path"].endswith('.csv'):
                        file_info["df"] = pd.read_csv(file_info["path"], on_bad_lines='skip')
                    else:
                        file_info["df"] = pd.read_excel(file_info["path"])
            
            # 2. Initialize Agent if needed
            if "sdf" not in file_info or file_info.get("sdf") is None:
                api_key = os.getenv("OPENAI_API_KEY")
                llm = OpenAI(api_token=api_key, model="gpt-4o-mini")
                file_info["sdf"] = SmartDataframe(file_info["df"], config={
                    "llm": llm, 
                    "enable_cache": True,
                    "model_name": "gpt-4o-mini"
                })
            
            # 3. Validation Run (Head/Describe)
            # This forces the agent to extract headers and potentially cache the schema
            print("   -> Running initial schema extraction...")
            file_info["sdf"].chat("Show me the first 5 rows")
            print(f"✅ Agent warmed up for {file_info['filename']}")
            
    except Exception as e:
        print(f"⚠️ Warmup failed: {e}")

# --- CONFIGURATION ---
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path, override=True)

app = FastAPI()

# --- DB STARTUP ---
@app.on_event("startup")
def on_startup():
    from sqlmodel import SQLModel
    SQLModel.metadata.create_all(engine)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MULTI-USER STATE MANAGEMENT ---
user_sessions: Dict[int, Dict[str, Any]] = {}

def get_user_session(user_id: int) -> Dict[str, Any]:
    """Retrieves session dict. If empty, tries to restore from DB."""
    # DEBUG PRINT
    if user_id in user_sessions:
        print(f"    - Found active session for user {user_id}")
    else:
        print(f"    - No active session for user {user_id}, restoring from DB...")
        user_sessions[user_id] = {"files": {}, "active_file_id": None}
        
        # Restore files from database
        from backend.database import SessionLocal
        from backend.models import UploadedFile
        from sqlmodel import select
        
        db = SessionLocal()
        try:
            statement = select(UploadedFile).where(UploadedFile.user_id == user_id)
            db_files = db.exec(statement).all()
            
            for db_file in db_files:
                user_sessions[user_id]["files"][db_file.file_id] = {
                    "id": db_file.file_id,
                    "filename": db_file.filename,
                    "path": db_file.file_path,
                    "source": db_file.source,
                    "url": db_file.url,
                    "df": None,  # Lazy load
                    "sdf": None,  # Lazy load
                    "timestamp": 0
                }
                # Set the most recent file as active
                if user_sessions[user_id]["active_file_id"] is None:
                    user_sessions[user_id]["active_file_id"] = db_file.file_id
                    
            print(f"    - Restored {len(db_files)} files from database")
        finally:
            db.close()
        
    return user_sessions[user_id]

class UserCreate(BaseModel):
    email: str
    password: str

# --- AUTH ROUTES ---

@app.post("/register")
async def register(user_data: UserCreate, session: Session = Depends(get_session)):
    # Check existing
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create User
    new_user = User(
        email=user_data.email,
        password_hash=get_password_hash(user_data.password)
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    
    # Generate Token
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
    print(f"🔍 get_user_session called for UserID: {user_id}")
    
    if user_id not in user_sessions:
        print(f"✨ Initializing fresh session for User ID: {user_id}")
        user_sessions[user_id] = {
            "files": {},
            "active_file_id": None
        }
        
        # RESTORE FROM DB
        try:
            with Session(engine) as db:
                statement = select(AnalysisSession).where(AnalysisSession.user_id == user_id)
                results = db.exec(statement).all()
                
                if results:
                    print(f"♻️  Restoring {len(results)} files from database...")
                    for record in results:
                        # Check if file exists on disk
                        if os.path.exists(record.file_path):
                            file_id = str(record.id) # Use Stable DB ID
                            source = "url" if "Google Sheet" in record.file_name else "file"
                            
                            user_sessions[user_id]["files"][file_id] = {
                                "df": None, # Lazy load
                                "filename": record.file_name,
                                "path": record.file_path,
                                "source": source,
                                "timestamp": os.path.getmtime(record.file_path)
                            }
                            user_sessions[user_id]["active_file_id"] = file_id
                            print(f"   -> Restored {record.file_name} (ID: {file_id})")
                else:
                    print(f"   -> No records found in DB for UserID: {user_id}")
                    
        except Exception as e:
            print(f"⚠️ Failed to restore session from DB: {e}")
            import traceback
            traceback.print_exc()
            
    return user_sessions[user_id]


class UserRegister(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class WidgetCreate(BaseModel):
    title: str
    vis_type: str
    payload: dict

class QueryRequest(BaseModel):
    query: str
    file_id: str | None = None

class ConnectRequest(BaseModel):
    url: str

# --- HELPER: DATA CLEANING ---
def sanitize_dataframe(df):
    # 1. Strip whitespace
    df.columns = [str(c).strip() for c in df.columns]
    
    # 2. Convert Dates
    for col in df.columns:
        if "date" in col.lower() or "time" in col.lower():
            try:
                df[col] = pd.to_datetime(df[col])
            except:
                pass
                
    # 3. Aggressive Sanitization for JSON
    df = df.replace([np.inf, -np.inf], np.nan)
    df = df.where(pd.notnull(df), None)
    
    for col in df.columns:
        if pd.api.types.is_float_dtype(df[col]):
             df[col] = df[col].astype(object).where(pd.notnull(df[col]), None)
             
    return df

def clean_for_json(obj):
    if isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, dict):
        return {k: clean_for_json(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_for_json(v) for v in obj]
    return obj

def detect_domain_context(df):
    cols = " ".join([str(c).lower() for c in df.columns])
    if any(x in cols for x in ['sales', 'revenue', 'profit', 'cost', 'qty']):
        return "Retail/Sales Context. Focus on: Revenue trends, Top selling products, Profit margins."
    elif any(x in cols for x in ['student', 'marks', 'grade', 'attendance', 'subject']):
        return "Education Context. Focus on: Student performance, Pass/Fail rates, Subject averages."
    elif any(x in cols for x in ['employee', 'salary', 'dept', 'hiring']):
        return "HR Context. Focus on: Headcount, Salary distribution, Attrition."
    else:
        return "General Data Analysis Context. Focus on patterns and outliers."

def detect_wide_format_dates(df):
    date_cols = 0
    total_cols = len(df.columns)
    if total_cols < 2: return False
    for col in df.columns:
        try:
            pd.to_datetime(str(col))
            date_cols += 1
        except: pass
    return (date_cols / total_cols) > 0.3

# --- ROUTES ---

@app.post("/register", response_model=Token)
def register(user_data: UserRegister, session: Session = Depends(get_session)):
    statement = select(User).where(User.email == user_data.email)
    existing_user = session.exec(statement).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user_data.password)
    user = User(email=user_data.email, password_hash=hashed_pwd)
    session.add(user)
    session.commit()
    session.refresh(user)
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/widget/save")
def save_widget(widget: WidgetCreate, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    new_widget = Widget(
        user_id=current_user.id,
        title=widget.title,
        vis_type=widget.vis_type,
        payload=widget.payload
    )
    session.add(new_widget)
    session.commit()
    session.refresh(new_widget)
    return {"message": "Widget saved!", "id": new_widget.id}

@app.get("/dashboard")
def get_dashboard(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Widget).where(Widget.user_id == current_user.id).order_by(Widget.created_at.desc())
    widgets = session.exec(statement).all()
    return widgets

@app.get("/files")
def get_files(request: Request):
    # Get user ID from session
    user_id = get_session_user_id(request)
    print(f"📂 GET /files called for user (ID: {user_id})")
    session_data = get_user_session(user_id)
    files_list = []
    
    for file_id, info in session_data["files"].items():
        files_list.append({
            "id": file_id,
            "filename": info["filename"],
            "source": info["source"]
        })
    
    print(f"   -> Returning {len(files_list)} files: {[f['filename'] for f in files_list]}")
    return files_list

@app.delete("/files/{file_id}")
def delete_file(file_id: str, request: Request, session: Session = Depends(get_session)):
    try:
        # Get user ID from session
        user_id = get_session_user_id(request)
        session_data = get_user_session(user_id)
        
        # 1. Check Memory
        if file_id in session_data["files"]:
            file_info = session_data["files"][file_id]
            file_path = file_info["path"]
            
            # Remove from Memory
            del session_data["files"][file_id]
            
            # If active, clear active
            if session_data.get("active_file_id") == file_id:
                session_data["active_file_id"] = None
                
            # 2. Remove from DB
            statement = select(AnalysisSession).where(AnalysisSession.user_id == user_id, AnalysisSession.file_path == file_path)
            results = session.exec(statement).all()
            for record in results:
                session.delete(record)
            session.commit()
            
            # 3. Remove from Disk (Optional: might want to keep if shared, but here it's per user)
            # Only delete if it exists and looks like a temp file we created
            if os.path.exists(file_path) and ("tmp" in file_path or "analytics_ai_uploads" in file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Warning: Could not delete file from disk: {e}")
            
            return {"message": "File deleted successfully"}
        else:
             raise HTTPException(status_code=404, detail="File not found")
             
    except Exception as e:
        print(f"Delete error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/connect_url")
async def connect_url(
    request_body: ConnectRequest,
    request: Request,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    try:
        # Get user ID from session
        user_id = get_session_user_id(request)
        
        url = request_body.url.strip()
        sheet_title = "Google Sheet Data"
        
        if "docs.google.com/spreadsheets" in url:
            match = re.search(r"/d/([a-zA-Z0-9-_]+)", url)
            if match:
                sheet_id = match.group(1)
                
                # Try to fetch title from public HTML
                try:
                    meta_url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/edit"
                    res = requests.get(meta_url, timeout=5)
                    if res.status_code == 200:
                        # Simple regex to find title tag: <title>SheetName - Google Sheets</title>
                        title_match = re.search(r"<title>(.*?) - Google Sheets</title>", res.text)
                        if title_match:
                            sheet_title = title_match.group(1).strip()
                except Exception as e:
                    print(f"Failed to fetch sheet title: {e}")

                gid_match = re.search(r"[#&]gid=([0-9]+)", url)
                gid_param = f"&gid={gid_match.group(1)}" if gid_match else ""
                url = f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv{gid_param}"
            else:
                 raise HTTPException(status_code=400, detail="Invalid Google Sheet URL")

        print(f"🌊 Streaming data from: {url}")
        
        # Use the fetched title for filename
        final_filename = f"{sheet_title}.csv"

        
        headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" }
        
        with requests.get(url, headers=headers, stream=True, timeout=30) as response:
            response.raise_for_status()
            if "text/html" in response.headers.get("Content-Type", ""):
                raise HTTPException(status_code=400, detail="❌ Permission Error: Sheet is private.")
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as tmp:
                for chunk in response.iter_content(chunk_size=8192):
                    tmp.write(chunk)
                tmp_path = tmp.name

        print(f"✅ Downloaded to {tmp_path}. Loading...")
        try:
            df = pd.read_csv(tmp_path, on_bad_lines='skip')
        except:
             df = pd.read_csv(tmp_path, on_bad_lines='skip', engine='python')
             
        df = sanitize_dataframe(df)
        
        # SAVE TO DB FIRST TO GET ID
        try:
            db_record = AnalysisSession(
                user_id=user_id,
                file_path=tmp_path,
                file_name=final_filename
            )
            session.add(db_record)
            session.commit()
            session.refresh(db_record)
            
            file_id = str(db_record.id) # Use Stable DB ID
            
            session_data = get_user_session(anonymous_user_id)
            session_data["files"][file_id] = {
                "df": df,
                "filename": final_filename,
                "path": tmp_path,
                "source": "url",
                "url": url
            }
            session_data["active_file_id"] = file_id

            # SCHEDULE WARMUP
            background_tasks.add_task(warmup_agent, anonymous_user_id, file_id)

        except Exception as e:
             print(f"Warning: Failed to save to DB: {e}")
             # Fallback if DB fails (shouldn't happen)
             file_id = str(uuid.uuid4())
             session_data = get_user_session(anonymous_user_id)
             session_data["files"][file_id] = {
                 "df": df, 
                 "filename": final_filename,
                 "path": tmp_path,
                 "source": "url",
                 "url": url
             }
             session_data["active_file_id"] = file_id

        return clean_for_json({
            "message": f"Connected! Loaded {len(df)} rows.", 
            "file_id": file_id,
            "filename": session_data["files"][file_id]["filename"],
            "columns": list(df.columns), 
            "preview": df.head(5).to_dict(orient="records")
        })

    except requests.exceptions.Timeout:
        raise HTTPException(status_code=400, detail="⏳ Connection Timed Out.")
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"❌ Error in connect_url: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to connect: {str(e)}")

@app.post("/upload")
async def upload_file(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...), 
    session: Session = Depends(get_session)
):
    try:
        # Get user ID from session
        user_id = get_session_user_id(request)
        
        upload_dir = os.path.join(tempfile.gettempdir(), "analytics_ai_uploads")
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path, on_bad_lines='skip')
        else:
            df = pd.read_excel(file_path)
            
        df = sanitize_dataframe(df)
        
        # SAVE TO DB FIRST
        db_record = AnalysisSession(
            user_id=user_id,
            file_path=file_path,
            file_name=file.filename
        )
        session.add(db_record)
        session.commit()
        session.refresh(db_record)
        
        file_id = str(db_record.id) # Use Stable DB ID
        
        session_data = get_user_session(user_id)
        session_data["files"][file_id] = {
            "df": df,
            "filename": file.filename,
            "path": file_path,
            "source": "file",
            "timestamp": os.path.getmtime(file_path)
        }
        session_data["active_file_id"] = file_id

        # SCHEDULE WARMUP
        background_tasks.add_task(warmup_agent, user_id, file_id)
        
        return clean_for_json({
            "message": "File Uploaded", 
            "file_id": file_id,
            "filename": file.filename,
            "columns": list(df.columns), 
            "preview": df.head(5).to_dict(orient="records")
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request_body: QueryRequest, request: Request):
    # Get user ID from session
    user_id = get_session_user_id(request)
    session_data = get_user_session(user_id)
    target_file_id = request_body.file_id or session_data.get("active_file_id")
    
    if not target_file_id or target_file_id not in session_data["files"]:
        raise HTTPException(status_code=400, detail="No active file selected. Please upload a file.")
    
    file_info = session_data["files"][target_file_id]
    
    # LAZY LOADING
    if file_info.get("df") is None:
        print(f"💤 Lazy Loading dataframe for {file_info['filename']}...")
        if file_info["path"].endswith('.csv'):
            file_info["df"] = sanitize_dataframe(pd.read_csv(file_info["path"], on_bad_lines='skip'))
        else:
            file_info["df"] = sanitize_dataframe(pd.read_excel(file_info["path"]))
    
    # AUTO REFRESH
    try:
        if file_info["source"] == "url" and file_info.get("url"):
             res = requests.get(file_info["url"])
             res.raise_for_status()
             res.raise_for_status()
             file_info["df"] = sanitize_dataframe(pd.read_csv(StringIO(res.text)))
             file_info["sdf"] = None # Invalidate cache
        elif file_info["source"] == "file" and file_info.get("path"):
            current_mtime = os.path.getmtime(file_info["path"])
            last_ts = file_info.get("timestamp", 0)
            if current_mtime > last_ts:
                print("File change detected! Reloading...")
                if file_info["path"].endswith('.csv'): 
                    new_df = pd.read_csv(file_info["path"])
                else: 
                    new_df = pd.read_excel(file_info["path"])
                file_info["df"] = sanitize_dataframe(new_df)
                file_info["timestamp"] = current_mtime
                file_info["sdf"] = None # Invalidate cache
    except Exception as e:
        print(f"Warning: Auto-refresh failed: {e}")

    # Detect domain context and format (needed for instructions)
    domain_context = detect_domain_context(file_info["df"])
    is_wide_format = detect_wide_format_dates(file_info["df"])
    wide_format_hint = ""
    if is_wide_format:
        wide_format_hint = "\nDATA STRUCTURE HINT: Wide Format Time Series."

    # CHECK FOR CACHED AGENT
    if "sdf" not in file_info or file_info.get("sdf") is None:
        print(f"🤖 Initializing new SmartDataframe Agent for {file_info['filename']}...")
        api_key = os.getenv("OPENAI_API_KEY")
        # USE FASTER MODEL
        llm = OpenAI(api_token=api_key, model="gpt-4o-mini")
        
        file_info["sdf"] = SmartDataframe(file_info["df"], config={
            "llm": llm, 
            "save_charts": False, 
            "open_charts": False, 
            "enable_cache": True,
            "custom_whitelisted_dependencies": ["json"]
        })
    else:
        print("⚡ Reusing cached SmartDataframe Agent")

    sdf = file_info["sdf"]
    
    instructions = f"""
    You are an intelligent Data Analytics Engine.
    CONTEXT: {domain_context}
    {wide_format_hint}
    
    TASK:
    1. ALWAYS PREFER VISUALIZATION over simple text.
    2. For "Top N" or "Distribution" or "Comparison" queries, ALWAYS return a "chart" widget with the data.
    3. Even for singular values, return a LIST containing `[{{ "vis_type": "kpi", ... }}, {{ "vis_type": "chart", ... }}]` if possible.
    
    REQUIRED OUTPUT FORMAT:
    You MUST return the result as a dictionary exactly like this:
    {{ "type": "string", "value": json.dumps(YOUR_DATA) }}
    
    WHERE YOUR_DATA is either:
    - A single widget object: {{ "vis_type": "...", "payload": ... }}
    - OR a LIST of widgets: [ {{ "vis_type": "...", ... }}, {{ "vis_type": "...", ... }} ]
    """
    
    try:
        response = sdf.chat(request_body.query + instructions)
        
        if isinstance(response, dict) and "type" in response and "value" in response:
            if response["type"] == "string":
                response = response["value"]
        
        if isinstance(response, (dict, list)):
            data = response
        else:
            clean_str = re.sub(r"```json|```", "", str(response)).strip()
            try:
                data = json.loads(clean_str)
            except:
                try: data = ast.literal_eval(clean_str)
                except: return {"type": "text", "payload": clean_str}

        # FIX: Handle case where LLM returns dict with 'kpi'/'chart' keys instead of list
        if isinstance(data, dict) and ('kpi' in data or 'chart' in data):
            new_list = []
            if 'kpi' in data: new_list.append(data['kpi'])
            if 'chart' in data: new_list.append(data['chart'])
            data = new_list

        # Validate and Fix Widgets
        final_widgets = []
        if isinstance(data, list):
            final_widgets = data
        elif isinstance(data, dict):
            if "vis_type" in data:
                final_widgets = [data]
            elif "type" in data:
                 vis_type = "kpi" if data["type"] == "kpi" else "chart"
                 final_widgets = [{"vis_type": vis_type, "payload": data}]
        
        # Post-process widgets to ensure frontend compatibility
        for widget in final_widgets:
            if widget.get("vis_type") == "chart":
                if "payload" in widget and isinstance(widget["payload"], dict):
                    # Default missing type to 'bar'
                    if "type" not in widget["payload"]:
                        widget["payload"]["type"] = "bar"
                    # Normalize type
                    widget["payload"]["type"] = str(widget["payload"]["type"]).lower()
                    
                    # Map common aliases
                    if widget["payload"]["type"] == "column": 
                        widget["payload"]["type"] = "bar"
        
        if final_widgets:
             print(f"✅ Returning {len(final_widgets)} widgets: {json.dumps(final_widgets, default=str)[:200]}...")
             return clean_for_json({"type": "dashboard", "payload": final_widgets})
            
        return clean_for_json({"type": "text", "payload": str(data)})

    except Exception as e:
        print(f"Error: {e}")
        return {"type": "text", "payload": f"Analysis failed: {str(e)}"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
