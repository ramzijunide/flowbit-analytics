import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ Flowbit API is running successfully!");
});

// ✅ 1️⃣ /stats → overview cards for dashboard
app.get("/api/stats", async (req, res) => {
  try {
    const totalFiles = await prisma.analyticsFile.count();
    const processedFiles = await prisma.analyticsFile.count({
      where: { status: "processed" },
    });

    const totalSize = await prisma.analyticsFile.aggregate({
      _sum: { fileSize: true },
    });

    res.json({
      totalFiles,
      processedFiles,
      totalSize: totalSize._sum.fileSize || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// ✅ 2️⃣ /files → list all files
app.get("/api/files", async (req, res) => {
  try {
    const files = await prisma.analyticsFile.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// ✅ 3️⃣ /files/:id → get a single file by ID
app.get("/api/files/:id", async (req, res) => {
  try {
    const file = await prisma.analyticsFile.findUnique({
      where: { id: req.params.id },
    });
    if (!file) return res.status(404).json({ error: "File not found" });
    res.json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch file" });
  }
});

// ✅ 4️⃣ /chat-with-data → forwards to Vanna AI (Python)
app.post("/chat-with-data", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("💬 Chat request received:", message);

    const vannaRes = await axios.post(
      `${process.env.VANNA_API_BASE_URL}/chat-with-data`,
      { message }
    );

    res.json(vannaRes.data);
  } catch (err) {
    console.error("Error in /chat-with-data:", err.message);
    res.status(500).json({ error: "Error connecting to Vanna AI" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

