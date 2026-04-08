import { NextRequest, NextResponse } from "next/server";

// GET /api/demandes/[id] — Get request details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Placeholder — in production, fetch from Prisma
  // For now return a demo request
  return NextResponse.json({
    id,
    referenceCode: "DY-2026-0001",
    category: "MEDICAL",
    displayName: "أحمد م.",
    isAnonymous: false,
    country: "MA",
    city: "الدار البيضاء",
    contactEmail: "private@example.com",
    titleAr: "تكاليف عملية جراحية عاجلة لطفل",
    titleFr: "Frais d'opération chirurgicale urgente pour un enfant",
    descriptionAr:
      "طفلي يحتاج إلى عملية جراحية عاجلة في القلب. تم تشخيص حالته من طرف أطباء مختصين في مستشفى الشيخ زايد بالرباط. تكلفة العملية تتجاوز قدرتنا المالية. نطلب من أهل الخير مساعدتنا في جمع المبلغ اللازم.",
    urgencyLevel: "CRITICAL",
    targetAmount: 50000,
    currentAmount: 12500,
    currency: "MAD",
    deadline: null,
    breakdown: [
      { label: "تكلفة العملية", amount: 35000 },
      { label: "أدوية", amount: 8000 },
      { label: "إقامة المستشفى", amount: 5000 },
      { label: "نقل المريض", amount: 2000 },
    ],
    beneficiaryName: "أحمد محمدي",
    iban: "MA64011100000000000000001",
    bic: "BCMAMAMC",
    bankName: "CIH Bank",
    bankCountry: "MA",
    documents: [],
    status: "PUBLISHED",
    progressPercent: 25,
    donorCount: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updates: [
      {
        id: "u1",
        contentAr: "تم تحديد موعد العملية يوم 15 أبريل. نشكر كل من ساهم حتى الآن.",
        contentFr: "La date de l'opération est fixée au 15 avril. Merci à tous les donateurs.",
        photos: [],
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        authorRole: "REQUESTER",
      },
    ],
  });
}

// PATCH /api/demandes/[id] — Update request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    // Placeholder — in production, update via Prisma
    return NextResponse.json({
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
