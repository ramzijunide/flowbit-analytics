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

#  Allow frontend to talk with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for local dev — allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#  Groq client
client = Groq(api_key=GROQ_API_KEY)


#  Database Query Runner
def run_query(sql):
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute(sql)
    columns = [desc[0] for desc in cur.description]
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [dict(zip(columns, row)) for row in rows]

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


#  Chat-with-Data endpoint
@app.post("/chat-with-data")
async def chat_with_data(request: Request):
    body = await request.json()
    message = body.get("message", "").strip()

    # -------------------------------
    #  SQL generation prompt
    # -------------------------------
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

Generate a valid PostgreSQL SQL query for the following question:
"{message}"

 Rules:
- Always wrap table and column names in double quotes.
- Do NOT include markdown or explanations.
- If user asks for "invoices", assume they mean rows where "name" ILIKE '%invoice%'.
- If they ask for "processed invoices", use WHERE "status" = 'processed' AND "name" ILIKE '%invoice%'.
- If the question involves counting or total, use COUNT(*) or SUM("fileSize").
- Only return the SQL query.
"""


    # -------------------------------
    #  Generate SQL using Groq LLM
    # -------------------------------
    sql_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a helpful SQL expert."},
            {"role": "user", "content": prompt},
        ],
    )

    # Extract model output
    sql = (
        sql_response.choices[0].message.content
        .replace("```sql", "")
        .replace("```", "")
        .strip()
    )

    # 🧩 Smart correction for count-based questions
    if any(keyword in message.lower() for keyword in ["count", "how many", "number of"]) \
        and "count" not in sql.lower():
        sql = 'SELECT COUNT(*) FROM "AnalyticsFile";'

    try:
        # Execute SQL
        result = run_query(sql)

        # Return formatted success response
        return {
            "reply": f"✅ SQL generated via Groq LLM for: {message}",
            "sql": sql,
            "result": result,
        }

    except Exception as e:
        # Return safe error response
        return {
            "error": str(e),
            "sql": sql,
            "reply": f"⚠️ SQL execution failed — please refine your query.\n🧠 Generated SQL:\n{sql}",
        }



