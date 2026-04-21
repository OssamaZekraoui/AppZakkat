export type VerificationStatus = "pending" | "verified" | "warning" | "rejected";
export type FlagSeverity = "info" | "warning" | "error";
export type MismatchSeverity = "low" | "medium" | "high";

export interface ExtractedDocumentData {
  documentType: string;
  personName?: string;
  amounts?: number[];
  dates?: string[];
  idNumber?: string;
  rawText?: string;
}

export interface DataMismatch {
  field: string;
  userProvided: string;
  extracted: string;
  severity: MismatchSeverity;
}

export interface VerificationFlag {
  type: "quality" | "authenticity" | "data" | "expiry";
  message: string;
  severity: FlagSeverity;
}

export interface DocumentVerificationResult {
  documentId: string;
  status: VerificationStatus;
  confidenceScore: number; // 0-100
  extractedData: ExtractedDocumentData;
  mismatches: DataMismatch[];
  flags: VerificationFlag[];
  verifiedAt: string;
}

export interface VerificationRequest {
  documentId: string;
  documentUrl: string;
  mimeType: string;
  category: string;
  userProvidedData: {
    displayName?: string;
    targetAmount?: number;
    country?: string;
    city?: string;
  };
}

export type AIRecommendation = "APPROVE" | "REVIEW" | "REJECT";

export interface RequestVerificationSummary {
  requestId: string;
  overallScore: number;
  recommendation: AIRecommendation;
  documentResults: DocumentVerificationResult[];
  verifiedAt: string;
}
