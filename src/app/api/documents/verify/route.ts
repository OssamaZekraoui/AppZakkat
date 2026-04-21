import { NextRequest, NextResponse } from "next/server";
import { createDocumentVerifier } from "@/lib/ai/documentVerifier";
import type { DocumentVerificationResult } from "@/types/verification";

// In-memory store for dev (maps requestId -> verification results)
const verificationStore: Record<string, DocumentVerificationResult[]> = {};

const verifier = createDocumentVerifier();

// POST /api/documents/verify — Verify a single document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, documentUrl, mimeType, category, userProvidedData, requestId } = body;

    if (!documentId || !category) {
      return NextResponse.json(
        { error: "documentId and category are required" },
        { status: 400 }
      );
    }

    const result = await verifier.verify({
      documentId,
      documentUrl: documentUrl || "",
      mimeType: mimeType || "application/pdf",
      category,
      userProvidedData: userProvidedData || {},
    });

    // Store result if requestId is provided
    if (requestId) {
      if (!verificationStore[requestId]) {
        verificationStore[requestId] = [];
      }
      // Replace existing result for the same document
      const existing = verificationStore[requestId].findIndex(
        (r) => r.documentId === documentId
      );
      if (existing >= 0) {
        verificationStore[requestId][existing] = result;
      } else {
        verificationStore[requestId].push(result);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Document verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}

// GET /api/documents/verify?requestId=xxx — Get verification results for a request
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      );
    }

    const results = verificationStore[requestId] || [];

    // Calculate overall score
    const overallScore =
      results.length > 0
        ? Math.round(
            results.reduce((sum, r) => sum + r.confidenceScore, 0) / results.length
          )
        : 0;

    const recommendation =
      overallScore >= 80 ? "APPROVE" : overallScore >= 50 ? "REVIEW" : "REJECT";

    return NextResponse.json({
      requestId,
      overallScore,
      recommendation,
      documentResults: results,
      verifiedAt: results.length > 0 ? results[results.length - 1].verifiedAt : null,
    });
  } catch (error) {
    console.error("Get verification results error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
