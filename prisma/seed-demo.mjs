import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

const pool = new Pool({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const demoRequests = [
  {
    referenceCode: "DEMO-MEDICAL-001",
    category: "MEDICAL",
    titleAr: "مساعدة في تكاليف عملية جراحية عاجلة",
    titleFr: "Aide pour une intervention chirurgicale urgente",
    descriptionAr: "أسرة محدودة الدخل تحتاج إلى دعم لتغطية تكاليف عملية جراحية والعلاج بعد العملية. هذا طلب تجريبي لعرض شكل المنصة.",
    targetAmount: 28000,
    currentAmount: 11200,
    country: "MA",
    city: "الدار البيضاء",
    isUrgent: true,
    deadlineDays: 18,
  },
  {
    referenceCode: "DEMO-EDUCATION-002",
    category: "EDUCATION",
    titleAr: "توفير لوازم مدرسية لأطفال قرية",
    titleFr: "Fournitures scolaires pour les enfants d'un village",
    descriptionAr: "مبادرة لتوفير الحقائب والكتب واللوازم المدرسية لتلاميذ من أسر هشة وتشجيعهم على مواصلة الدراسة.",
    targetAmount: 15000,
    currentAmount: 9750,
    country: "MA",
    city: "الحوز",
    isUrgent: false,
    deadlineDays: 45,
  },
  {
    referenceCode: "DEMO-RELIGIOUS-003",
    category: "RELIGIOUS",
    titleAr: "ترميم مسجد قروي وتجهيز مكان الوضوء",
    titleFr: "Rénovation d'une mosquée rurale et de ses ablutions",
    descriptionAr: "مشروع محلي لإصلاح سقف مسجد قديم وتجديد مرافق الوضوء بما يحفظ سلامة وراحة المصلين.",
    targetAmount: 60000,
    currentAmount: 18300,
    country: "MA",
    city: "تارودانت",
    isUrgent: false,
    deadlineDays: 75,
  },
  {
    referenceCode: "DEMO-HUMANITARIAN-004",
    category: "HUMANITARIAN",
    titleAr: "قفة غذائية لأسر في وضعية صعبة",
    titleFr: "Paniers alimentaires pour des familles vulnérables",
    descriptionAr: "حملة تضامنية لتوزيع مواد غذائية أساسية على أسر محتاجة، بعد التحقق من الحالات المستفيدة.",
    targetAmount: 22000,
    currentAmount: 17600,
    country: "MA",
    city: "فاس",
    isUrgent: true,
    deadlineDays: 12,
  },
  {
    referenceCode: "DEMO-PERSONAL-005",
    category: "PERSONAL",
    titleAr: "مساعدة أم معيلة على أداء واجب الكراء",
    titleFr: "Soutien au loyer d'une mère de famille",
    descriptionAr: "مساعدة مؤقتة لأم معيلة تمر بضائقة مالية حتى تتمكن من أداء متأخرات الكراء واستعادة استقرار أسرتها.",
    targetAmount: 9000,
    currentAmount: 2700,
    country: "MA",
    city: "الرباط",
    isUrgent: true,
    deadlineDays: 9,
  },
  {
    referenceCode: "DEMO-FUNERAL-006",
    category: "FUNERAL",
    titleAr: "دعم أسرة في مصاريف جنازة",
    titleFr: "Soutien à une famille pour des frais funéraires",
    descriptionAr: "مساهمة تضامنية عاجلة لتخفيف مصاريف الدفن والجنازة عن أسرة محدودة الموارد.",
    targetAmount: 7000,
    currentAmount: 5600,
    country: "MA",
    city: "مكناس",
    isUrgent: true,
    deadlineDays: 5,
  },
  {
    referenceCode: "DEMO-ASSOCIATION-007",
    category: "ASSOCIATION",
    titleAr: "تجهيز مركز استقبال للأشخاص بدون مأوى",
    titleFr: "Équipement d'un centre d'accueil pour sans-abri",
    descriptionAr: "جمعية محلية تحتاج إلى أغطية وأسرة ومستلزمات نظافة لتحسين استقبال الأشخاص بدون مأوى خلال فصل الشتاء.",
    targetAmount: 35000,
    currentAmount: 8750,
    country: "MA",
    city: "طنجة",
    isUrgent: false,
    deadlineDays: 60,
  },
  {
    referenceCode: "DEMO-ORPHANS-008",
    category: "ORPHANS",
    titleAr: "كفالة دراسية وصحية لأطفال أيتام",
    titleFr: "Soutien scolaire et médical pour des orphelins",
    descriptionAr: "برنامج تكافل لتغطية المصاريف المدرسية والفحوصات الصحية الأساسية لأطفال أيتام طوال السنة.",
    targetAmount: 48000,
    currentAmount: 33600,
    country: "MA",
    city: "وجدة",
    isUrgent: false,
    deadlineDays: 90,
  },
];

async function main() {
  const password = await bcrypt.hash("demo-account-not-for-login", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo.seed@diyae.local" },
    update: { name: "حساب تجريبي — ضياء" },
    create: {
      email: "demo.seed@diyae.local",
      password,
      name: "حساب تجريبي — ضياء",
      country: "MA",
      locale: "ar",
      currency: "MAD",
    },
  });

  const now = Date.now();
  for (const [index, request] of demoRequests.entries()) {
    const { city, deadlineDays, ...requestData } = request;
    const deadline = new Date(now + deadlineDays * 24 * 60 * 60 * 1000);
    const documents = {
      currency: "MAD",
      city,
      files: [],
      demo: true,
    };

    await prisma.request.upsert({
      where: { referenceCode: request.referenceCode },
      update: {
        ...requestData,
        userId: user.id,
        status: "PUBLISHED",
        iban: "MA64 0000 0000 0000 0000 0000 000",
        deadline,
        documents,
        isAnonymous: index % 3 === 1,
      },
      create: {
        ...requestData,
        userId: user.id,
        status: "PUBLISHED",
        iban: "MA64 0000 0000 0000 0000 0000 000",
        deadline,
        documents,
        isAnonymous: index % 3 === 1,
      },
    });
  }

  const requesterPassword = await bcrypt.hash("Demandeur2026!", 12);
  const requester = await prisma.user.upsert({
    where: { email: "demandeur@zakkat.demo" },
    update: {
      password: requesterPassword,
      name: "Amina El Mansouri",
      role: "USER",
    },
    create: {
      email: "demandeur@zakkat.demo",
      password: requesterPassword,
      name: "Amina El Mansouri",
      role: "USER",
      country: "MA",
      locale: "fr",
      currency: "MAD",
    },
  });

  const adminPassword = await bcrypt.hash("AdminZakkat2026!", 12);
  await prisma.user.upsert({
    where: { email: "admin@zakkat.demo" },
    update: {
      password: adminPassword,
      name: "Administrateur Zakkat",
      role: "ADMIN",
    },
    create: {
      email: "admin@zakkat.demo",
      password: adminPassword,
      name: "Administrateur Zakkat",
      role: "ADMIN",
      country: "MA",
      locale: "fr",
      currency: "MAD",
    },
  });

  await prisma.request.upsert({
    where: { referenceCode: "SIMULATION-PENDING-001" },
    update: {
      userId: requester.id,
      status: "SUBMITTED",
      currentAmount: 0,
    },
    create: {
      userId: requester.id,
      category: "MEDICAL",
      titleAr: "طلب مساعدة لشراء علاج طبي",
      titleFr: "Aide pour un traitement médical",
      descriptionAr: "طلب تجريبي في انتظار مراجعة الإدارة قبل نشره على منصة الزكاة.",
      targetAmount: 12500,
      currentAmount: 0,
      status: "SUBMITTED",
      iban: "MA64 0000 0000 0000 0000 0000 000",
      referenceCode: "SIMULATION-PENDING-001",
      country: "MA",
      isUrgent: true,
      isAnonymous: false,
      deadline: new Date(now + 30 * 24 * 60 * 60 * 1000),
      documents: {
        currency: "MAD",
        city: "Casablanca",
        files: [],
        demo: true,
        simulation: true,
      },
    },
  });

  console.log(`${demoRequests.length} demandes publiées et 1 demande en attente sont prêtes.`);
  console.log("Demandeur : demandeur@zakkat.demo / Demandeur2026!");
  console.log("Admin      : admin@zakkat.demo / AdminZakkat2026!");
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
