import streamlit as st
import pandas as pd
from pandasai import SmartDataframe
# Ensure you have the openai plugin installed: pip install pandasai-openai
from pandasai_openai import OpenAI 
import os

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="Stall Analytics Bot",
    page_icon="📊",
    layout="wide"
)

# --- CUSTOM CSS (Cleaner UI) ---
def local_css():
    st.markdown("""
        <style>
        #MainMenu {visibility: hidden;} 
        footer {visibility: hidden;}    
        header {visibility: hidden;}    
        .stChatInput {position: fixed; bottom: 30px;} 
        </style>
        """, unsafe_allow_html=True)
local_css()

# --- 1. SETUP THE LLM ---
# Replace with your actual OpenAI API Key
OPENAI_API_KEY = "sk-..." # <--- PASTE KEY HERE

llm = OpenAI(api_token=OPENAI_API_KEY)

# --- 2. SIDEBAR & FILE UPLOAD ---
with st.sidebar:
    st.title("📂 Data Setup")
    
    # A. File Uploader
    uploaded_file = st.file_uploader("Upload your CSV or Excel file", type=['csv', 'xlsx'])
    
    # B. Reset Button
    if st.button("🔄 Reset Conversation"):
        st.session_state.messages = [] # Clear history
        st.rerun()

# --- 3. LOAD DATA LOGIC ---
@st.cache_data
def load_data(file):
    try:
        if file.name.endswith('.csv'):
            return pd.read_csv(file)
        else:
            return pd.read_excel(file)
    except Exception as e:
        st.error(f"Error loading file: {e}")
        return None

# Initialize DF
df = None
if uploaded_file is not None:
    df = load_data(uploaded_file)
else:
    # OPTIONAL: Load default demo data if nothing is uploaded yet
    if os.path.exists("stall_data.csv"):
        df = pd.read_csv("stall_data.csv")
        st.info("ℹ️ Using default demo data. Upload a file to switch.")
    else:
        st.warning("👈 Please upload a dataset to begin.")

# --- 4. PREVIEW DATA IN SIDEBAR ---
with st.sidebar:
    if df is not None:
        st.divider()
        st.header("🗃️ Data Preview")
        st.dataframe(df.head(5))
        st.caption(f"Total Rows: {len(df)}")
        st.caption(f"Columns: {', '.join(list(df.columns))}")

# --- 5. MAIN CHAT INTERFACE ---
st.title("🤖 AI Data Analyst")

if df is not None:
    # Initialize SmartDataframe
    sdf = SmartDataframe(df, config={
        "llm": llm,
        "save_charts": True,
        "save_charts_path": "exports/charts",
        "open_charts": False, 
        "description": "You are a senior data analyst. Analyze the uploaded data and generate charts."
    })

    # A. Quick Insight Buttons (Dynamic based on data availability)
    st.subheader("💡 Quick Insights")
    col1, col2, col3 = st.columns(3)
    
    prompt = None
    
    # We use generic labels now since user might upload ANY data
    if col1.button("📊 Analyze Trends"):
        prompt = "Analyze the most important time-based trend in this data and plot a line chart."
    if col2.button("🏆 Identify Top Performers"):
        prompt = "Identify the top performing item (product/category/person) by value and plot a bar chart."
    if col3.button("🍰 Show Distribution"):
        prompt = "Plot a pie chart showing the distribution of the main categorical column."

    # B. User Input Area
    user_input = st.chat_input("Ask a question about your data...")

    # Logic: Prioritize button click, otherwise use text input
    final_query = prompt if prompt else user_input

    if final_query:
        # Display User Message
        with st.chat_message("user"):
            st.write(final_query)

        # Generate Response
        with st.chat_message("assistant"):
            with st.spinner("Analyzing..."):
                try:
                    response = sdf.chat(final_query)
                    
                    response_str = str(response)
                    
                    # Check for image or text
                    if response_str.endswith(".png") and os.path.exists(response_str):
                        st.image(response_str)
                    else:
                        st.write(response)
                        
                except Exception as e:
                    st.error(f"I couldn't generate that insight. Error: {e}")

else:
    # Welcome Screen if no data
    st.markdown("""
    ### 👋 Welcome to the Stall!
    To get started:
    1. Upload a **CSV** or **Excel** file in the sidebar.
    2. Or use the default demo data loaded automatically.
    """)