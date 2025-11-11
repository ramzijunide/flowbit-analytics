from fastapi import FastAPI, Request
import psycopg2
import os
from dotenv import load_dotenv
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://flowbit-analytics-1-3mtb.onrender.com",
        "https://flowbit-analytics.vercel.app",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)


def run_query(sql):
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute(sql)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]


@app.get("/")
def home():
    return {"message": "✅ Flowbit Analytics API is running!"}


@app.post("/chat-with-data")
async def chat_with_data(request: Request):
    body = await request.json()
    message = body.get("message", "")

    prompt = f"""
You are an expert SQL assistant.
The PostgreSQL database has a table called "AnalyticsFile" with these columns:
- id (UUID)
- name (TEXT)
- fileType (TEXT)
- status (TEXT)
- fileSize (INTEGER)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

Generate a valid SQL query (PostgreSQL syntax) that answers the following question:
Always wrap table and column names in double quotes — for example: SELECT * FROM "AnalyticsFile".
If the question asks for "processed invoices", interpret it as rows with status='processed'.
Only return the SQL query, no markdown or code fences.
"""

    sql_response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
    )

    sql = (
        sql_response.choices[0].message.content
        .replace("```sql", "")
        .replace("```", "")
        .strip()
    )

    if any(keyword in message.lower() for keyword in ["count", "how many", "number of"]) \
        and "count" not in sql.lower():
        sql = 'SELECT COUNT(*) FROM "AnalyticsFile";'

    try:
        result = run_query(sql)
        return {
            "reply": f"SQL generated via Groq LLM for: {message}",
            "sql": sql,
            "result": result,
        }

    except Exception as e:
        return {
            "error": str(e),
            "sql": sql,
            "reply": f"SQL execution failed. {str(e)}"
        }


@app.get("/api/stats")
async def get_stats():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        # Total files
        cur.execute('SELECT COUNT(*) FROM "AnalyticsFile";')
        total_files = cur.fetchone()[0]

        # Processed files
        cur.execute('SELECT COUNT(*) FROM "AnalyticsFile" WHERE "status" = %s;', ('processed',))
        processed_files = cur.fetchone()[0]

        # Invoices
        cur.execute('SELECT COUNT(*) FROM "AnalyticsFile" WHERE "fileType" = %s;', ('invoice',))
        invoices = cur.fetchone()[0]

        cur.close()
        conn.close()

        return {
            "total_files": total_files,
            "processed_files": processed_files,
            "invoices": invoices
        }

    except Exception as e:
        return {"error": str(e)}



