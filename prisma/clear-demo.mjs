import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const demoUsers = await prisma.user.findMany({
    where: {
      email: {
        in: ["demo.seed@diyae.local", "demandeur@zakkat.demo", "admin@zakkat.demo"],
      },
    },
    select: { id: true },
  });

  if (demoUsers.length === 0) {
    console.log("Aucune donnée de démonstration à supprimer.");
    return;
  }

  const demoUserIds = demoUsers.map(({ id }) => id);

  const demoRequests = await prisma.request.findMany({
    where: { userId: { in: demoUserIds } },
    select: { id: true },
  });
  const requestIds = demoRequests.map(({ id }) => id);

  if (requestIds.length > 0) {
    await prisma.requestUpdate.deleteMany({ where: { requestId: { in: requestIds } } });
    await prisma.request.deleteMany({ where: { id: { in: requestIds } } });
  }

  await prisma.user.deleteMany({ where: { id: { in: demoUserIds } } });
  console.log(`${requestIds.length} demandes de démonstration ont été supprimées.`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
