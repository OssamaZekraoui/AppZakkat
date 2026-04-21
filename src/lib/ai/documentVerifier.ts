import type {
  VerificationRequest,
  DocumentVerificationResult,
  VerificationStatus,
  ExtractedDocumentData,
  DataMismatch,
  VerificationFlag,
} from "@/types/verification";

export interface IDocumentVerifier {
  verify(request: VerificationRequest): Promise<DocumentVerificationResult>;
}

/**
 * Mock document verifier for development.
 * Simulates OCR extraction, data comparison, and scoring.
 * Replace with a real provider (Claude, Google Vision, etc.) in production.
 */
export class MockDocumentVerifier implements IDocumentVerifier {
  async verify(request: VerificationRequest): Promise<DocumentVerificationResult> {
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const extractedData = this.simulateExtraction(request);
    const mismatches = this.compareData(request, extractedData);
    const flags = this.generateFlags(request, extractedData);
    const confidenceScore = this.calculateScore(mismatches, flags);
    const status = this.determineStatus(confidenceScore);

    return {
      documentId: request.documentId,
      status,
      confidenceScore,
      extractedData,
      mismatches,
      flags,
      verifiedAt: new Date().toISOString(),
    };
  }

  private simulateExtraction(request: VerificationRequest): ExtractedDocumentData {
    const baseData: ExtractedDocumentData = {
      documentType: this.mapCategoryToDocType(request.category),
      rawText: "[Simulated OCR text content]",
    };

    // Simulate extracted name (sometimes matching, sometimes not)
    if (request.userProvidedData.displayName) {
      const shouldMatch = Math.random() > 0.2;
      baseData.personName = shouldMatch
        ? request.userProvidedData.displayName
        : request.userProvidedData.displayName.split(" ")[0] + " (variant)";
    }

    // Simulate extracted amounts
    if (request.userProvidedData.targetAmount) {
      const shouldMatch = Math.random() > 0.3;
      baseData.amounts = shouldMatch
        ? [request.userProvidedData.targetAmount]
        : [request.userProvidedData.targetAmount * (0.8 + Math.random() * 0.4)];
    }

    // Simulate dates
    baseData.dates = [new Date().toISOString().split("T")[0]];

    return baseData;
  }

  private compareData(
    request: VerificationRequest,
    extracted: ExtractedDocumentData
  ): DataMismatch[] {
    const mismatches: DataMismatch[] = [];

    if (
      request.userProvidedData.displayName &&
      extracted.personName &&
      extracted.personName !== request.userProvidedData.displayName
    ) {
      mismatches.push({
        field: "displayName",
        userProvided: request.userProvidedData.displayName,
        extracted: extracted.personName,
        severity: "medium",
      });
    }

    if (
      request.userProvidedData.targetAmount &&
      extracted.amounts?.[0] &&
      Math.abs(extracted.amounts[0] - request.userProvidedData.targetAmount) >
        request.userProvidedData.targetAmount * 0.1
    ) {
      mismatches.push({
        field: "targetAmount",
        userProvided: String(request.userProvidedData.targetAmount),
        extracted: String(Math.round(extracted.amounts[0])),
        severity: "high",
      });
    }

    return mismatches;
  }

  private generateFlags(
    request: VerificationRequest,
    _extracted: ExtractedDocumentData
  ): VerificationFlag[] {
    const flags: VerificationFlag[] = [];

    // Simulate quality check
    if (Math.random() > 0.7) {
      flags.push({
        type: "quality",
        message: "Document resolution is low, some text may not be readable",
        severity: "warning",
      });
    }

    // Check file type
    if (request.mimeType === "image/heic") {
      flags.push({
        type: "quality",
        message: "HEIC format detected, conversion may affect quality",
        severity: "info",
      });
    }

    // Simulate expiry check
    if (Math.random() > 0.85) {
      flags.push({
        type: "expiry",
        message: "Document may be expired based on detected dates",
        severity: "warning",
      });
    }

    return flags;
  }

  private calculateScore(mismatches: DataMismatch[], flags: VerificationFlag[]): number {
    let score = 95;

    for (const m of mismatches) {
      if (m.severity === "high") score -= 25;
      else if (m.severity === "medium") score -= 15;
      else score -= 5;
    }

    for (const f of flags) {
      if (f.severity === "error") score -= 20;
      else if (f.severity === "warning") score -= 10;
      else score -= 2;
    }

    return Math.max(0, Math.min(100, score));
  }

  private determineStatus(score: number): VerificationStatus {
    if (score >= 80) return "verified";
    if (score >= 50) return "warning";
    return "rejected";
  }

  private mapCategoryToDocType(category: string): string {
    const mapping: Record<string, string> = {
      MEDICAL_REPORT: "Medical Report",
      INVOICE: "Invoice / Estimate",
      PROOF_OF_IDENTITY: "Identity Document",
      BANK_STATEMENT: "Bank Statement",
      ASSOCIATION_DOCS: "Association Documents",
      PHOTOS: "Photograph",
      OTHER: "Other Document",
    };
    return mapping[category] || "Unknown";
  }
}

export function createDocumentVerifier(): IDocumentVerifier {
  // In production, replace with a real verifier (e.g., ClaudeDocumentVerifier)
  return new MockDocumentVerifier();
}
