/// <reference types="node" />
import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env" }); // Load env manually

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!, // ✅ Works fine
  },
});

