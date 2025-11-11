import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync("../../data/Analytics_Test_Data.json", "utf8"));

  for (const doc of data) {
    await prisma.analyticsFile.create({
      data: {
        id: doc._id,
        name: doc.name,
        filePath: doc.filePath,
        fileSize: parseInt(doc.fileSize?.$numberLong || 0),
        fileType: doc.fileType || "unknown",
        status: doc.status || "unknown",
        organizationId: doc.organizationId || "N/A",
        departmentId: doc.departmentId || "N/A",
        createdAt: new Date(doc.createdAt?.$date || Date.now()),
        updatedAt: new Date(doc.updatedAt?.$date || Date.now()),
        userId: doc.metadata?.userId || null,
        docId: doc.metadata?.docId || null,
      },
    });
  }

  console.log("✅ Data seeded successfully!");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });

