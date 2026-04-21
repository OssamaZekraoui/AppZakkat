import { NextRequest, NextResponse } from "next/server";
import { getRequestsStore } from "@/lib/stores/requestsStore";

// GET /api/admin/demandes/[id] — Get full request details for admin review
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const store = getRequestsStore();
    const request = store[id];

    if (!request) {
      // Return demo data if no real request exists (dev convenience)
      return NextResponse.json({
        id,
        referenceCode: "DY-2026-0001",
        category: "MEDICAL",
        displayName: "أحمد م.",
        isAnonymous: false,
        country: "MA",
        city: "الدار البيضاء",
        contactEmail: "private@example.com",
        contactPhone: "+212 6XX-XXXXXX",
        titleAr: "تكاليف عملية جراحية عاجلة لطفل",
        titleFr: "Frais d'opération chirurgicale urgente pour un enfant",
        descriptionAr:
          "طفلي يحتاج إلى عملية جراحية عاجلة في القلب. تم تشخيص حالته من طرف أطباء مختصين في مستشفى الشيخ زايد بالرباط. تكلفة العملية تتجاوز قدرتنا المالية. نطلب من أهل الخير مساعدتنا في جمع المبلغ اللازم.",
        descriptionFr:
          "Mon enfant a besoin d'une opération cardiaque urgente. Son état a été diagnostiqué par des spécialistes à l'hôpital Cheikh Zayed de Rabat. Le coût de l'opération dépasse nos moyens financiers.",
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
        documents: [
          {
            id: "doc-1",
            filename: "rapport-medical.pdf",
            originalName: "تقرير طبي - مستشفى الشيخ زايد.pdf",
            url: "/uploads/rapport-medical.pdf",
            category: "MEDICAL_REPORT",
            mimeType: "application/pdf",
            size: 245760,
          },
          {
            id: "doc-2",
            filename: "devis-chirurgie.pdf",
            originalName: "عرض سعر العملية الجراحية.pdf",
            url: "/uploads/devis-chirurgie.pdf",
            category: "INVOICE",
            mimeType: "application/pdf",
            size: 189440,
          },
          {
            id: "doc-3",
            filename: "cin.jpg",
            originalName: "البطاقة الوطنية.jpg",
            url: "/uploads/cin.jpg",
            category: "PROOF_OF_IDENTITY",
            mimeType: "image/jpeg",
            size: 512000,
          },
        ],
        status: "SUBMITTED",
        progressPercent: 25,
        donorCount: 8,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString(),
        updates: [],
      });
    }

    return NextResponse.json(request);
  } catch (error) {
    console.error("Admin get request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
