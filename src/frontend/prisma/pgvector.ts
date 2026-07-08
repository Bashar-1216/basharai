import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Enabling pgvector extension and creating embeddings columns...");

  try {
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS vector;`);
    console.log("✔ pgvector extension enabled.");
  } catch (err: any) {
    console.error("Error enabling vector extension:", err.message || err);
  }

  try {
    // Note: ALTER TABLE ... ADD COLUMN IF NOT EXISTS is not standard PostgreSQL before v9.6, but perfectly valid in PostgreSQL 9.6+.
    // Since we are running PostgreSQL 17, it is fully supported.
    await prisma.$executeRawUnsafe(`ALTER TABLE "Chunk" ADD COLUMN IF NOT EXISTS "embedding_en" vector(1536);`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Chunk" ADD COLUMN IF NOT EXISTS "embedding_ar" vector(1536);`);
    console.log("✔ Vector columns added to Chunk table.");
  } catch (err: any) {
    console.error("Error adding vector columns:", err.message || err);
  }

  try {
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Chunk_embedding_en_hnsw_idx" 
      ON "Chunk" USING hnsw (embedding_en vector_cosine_ops) 
      WITH (m = 16, ef_construction = 64);
    `);
    await prisma.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Chunk_embedding_ar_hnsw_idx" 
      ON "Chunk" USING hnsw (embedding_ar vector_cosine_ops) 
      WITH (m = 16, ef_construction = 64);
    `);
    console.log("✔ HNSW cosine similarity indexes created.");
  } catch (err: any) {
    console.error("Error creating HNSW indexes:", err.message || err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
