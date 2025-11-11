#  Flowbit Analytics

Flowbit Analytics is an intelligent **data-driven analytics platform** that allows users to interact with uploaded files (invoices, PDFs, etc.) using **natural language queries** — powered by **Groq LLM** and **PostgreSQL**.

The system automatically interprets user queries (like *“Show all processed invoices”* or *“Count total uploaded files”*), generates SQL dynamically, executes it on the database, and returns the results in real-time.

---

##  **Project Architecture**

### **Frontend (Next.js + TypeScript)**
- Built with **Next.js (App Router)** and **Tailwind CSS**
- Components for dashboard charts, chat interface, and side navigation  
- Located in: `/apps/web`

### **Backend (Node.js + Express + Prisma)**
- RESTful API built with **Express.js**  
- Connects to a **PostgreSQL database** via Prisma ORM  
- Handles file metadata, statistics, and status tracking  
- Located in: `/apps/api`

### **AI Query Assistant (FastAPI + Groq LLM)**
- Written in **Python (FastAPI)**  
- Integrates with **Groq’s Llama 3.3 model**  
- Dynamically generates SQL queries from user questions  
- Located in: `/apps/vanna`

### **Database**
- PostgreSQL (via Prisma)
- Table: `"AnalyticsFile"`
  - id (UUID)
  - name (TEXT)
  - fileType (TEXT)
  - status (TEXT)
  - fileSize (INTEGER)
  - createdAt / updatedAt (TIMESTAMP)

---

##  **Installation & Setup**

### **1️ Clone the Repository**
```bash
git clone https://github.com/ramzijunide/flowbit-analytics.git
cd flowbit-analytics
Install Dependencies

**Frontend:**
cd apps/web
npm install


**Backend:**

cd ../api
npm install


**AI Server:**

cd ../vanna
pip install -r requirements.txt

## **Configure Environment Variables**

Create .env files as follows:

For API
DATABASE_URL=postgresql://user:password@localhost:5432/flowbit
PORT=5000

For Python (Vanna)
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/flowbit

Run the Servers

Start Express API

cd apps/api
npm start


Start FastAPI (Groq Integration)

cd ../vanna
uvicorn server:app --port 8000


Start Next.js Frontend

cd ../web
npm run dev


Then open 👉 http://localhost:3000

Example Chat Queries
Query	Expected SQL
“Show all processed invoices”	SELECT * FROM "AnalyticsFile" WHERE "status"='processed';
“How many invoices are there?”	SELECT COUNT(*) FROM "AnalyticsFile" WHERE "fileType"='invoice';
“Show latest uploaded files”	SELECT * FROM "AnalyticsFile" ORDER BY "createdAt" DESC LIMIT 5;
“List pending documents”	SELECT * FROM "AnalyticsFile" WHERE "status"='pending';

Tech Stack
Layer	Technology
Frontend	Next.js 14, Tailwind CSS
Backend	Express.js, Prisma ORM
Database	PostgreSQL
AI Engine	FastAPI + Groq Llama 3.3
Deployment	(Optional) Vercel / Render / Railway

Project Summary

This project demonstrates:

Full-stack integration (Next.js + Express + FastAPI)

Natural Language → SQL translation using Groq LLM

Dynamic dashboard & analytics visualization

Modular, multi-app monorepo architecture

Developed by

Mohammed Ramzim
Integrated M.Tech Software Engineering
VIT Chennai
<img width="1919" height="957" alt="Screenshot 2025-11-11 235656" src="https://github.com/user-attachments/assets/48c35e80-17ea-48f5-a5ff-6fb2238dcdf6" />
<img width="1919" height="939" alt="Screenshot 2025-11-11 235740" src="https://github.com/user-attachments/assets/1ac4499f-8938-42a8-9f76-3f5ae5a33516" />
<img width="1917" height="937" alt="Screenshot 2025-11-11 235816" src="https://github.com/user-attachments/assets/98b6187f-f196-4ca1-9f13-13efeb1bb3f9" />
