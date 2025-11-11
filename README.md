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

## ⚙️ **Installation & Setup**

### **1️ Clone the Repository**
```bash
git clone https://github.com/ramzijunide/flowbit-analytics.git
cd flowbit-analytics
