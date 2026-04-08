export type RequestCategory =
  | "PERSONAL"
  | "MEDICAL"
  | "RELIGIOUS"
  | "ASSOCIATION"
  | "HUMANITARIAN"
  | "EDUCATION"
  | "FUNERAL";

export type RequestStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "CLOSED";

export type Currency = "MAD" | "EUR" | "USD" | "GBP";
export type UrgencyLevel = "NORMAL" | "URGENT" | "CRITICAL";

export type DocumentCategory =
  | "MEDICAL_REPORT"
  | "INVOICE"
  | "PROOF_OF_IDENTITY"
  | "BANK_STATEMENT"
  | "ASSOCIATION_DOCS"
  | "PHOTOS"
  | "OTHER";

export interface AmountBreakdown {
  label: string;
  amount: number;
  justification?: string;
}

export interface UploadedDocument {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  category: DocumentCategory;
  uploadedAt: string;
}

export interface RequestFormData {
  // Step 0
  category: RequestCategory;

  // Step 1
  displayName: string;
  isAnonymous: boolean;
  country: string;
  city: string;
  contactEmail: string;
  contactPhone?: string;

  // Step 2
  titleAr: string;
  titleFr?: string;
  descriptionAr: string;
  descriptionFr?: string;
  urgencyLevel: UrgencyLevel;

  // Step 3
  targetAmount: number;
  currency: Currency;
  deadline: string | null;
  breakdown: AmountBreakdown[];

  // Step 4
  beneficiaryName: string;
  iban: string;
  bic: string;
  bankName: string;
  bankCountry: string;

  // Step 5
  documents: UploadedDocument[];

  // Step 6
  declarationAccepted: boolean;
  honorAccepted: boolean;
}

export interface RequestUpdate {
  id: string;
  contentAr: string;
  contentFr?: string;
  photos: string[];
  createdAt: string;
  authorRole: "REQUESTER" | "ADMIN";
}

export interface RequestWithStatus extends RequestFormData {
  id: string;
  referenceCode: string;
  status: RequestStatus;
  currentAmount: number;
  progressPercent: number;
  donorCount: number;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  updates: RequestUpdate[];
}

export const DEFAULT_FORM_DATA: RequestFormData = {
  category: "PERSONAL",
  displayName: "",
  isAnonymous: false,
  country: "MA",
  city: "",
  contactEmail: "",
  contactPhone: "",
  titleAr: "",
  titleFr: "",
  descriptionAr: "",
  descriptionFr: "",
  urgencyLevel: "NORMAL",
  targetAmount: 0,
  currency: "MAD",
  deadline: null,
  breakdown: [],
  beneficiaryName: "",
  iban: "",
  bic: "",
  bankName: "",
  bankCountry: "MA",
  documents: [],
  declarationAccepted: false,
  honorAccepted: false,
};

export interface CategoryInfo {
  value: RequestCategory;
  labelAr: string;
  labelFr: string;
  labelEn: string;
  icon: string;
  descAr: string;
  descFr: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    value: "PERSONAL",
    labelAr: "مساعدة شخصية",
    labelFr: "Aide personnelle",
    labelEn: "Personal aid",
    icon: "🤲",
    descAr: "مساعدة مالية لظروف شخصية",
    descFr: "Aide financière pour circonstances personnelles",
  },
  {
    value: "MEDICAL",
    labelAr: "مساعدة طبية",
    labelFr: "Aide médicale",
    labelEn: "Medical aid",
    icon: "🏥",
    descAr: "تكاليف علاج أو عملية جراحية",
    descFr: "Frais de traitement ou opération chirurgicale",
  },
  {
    value: "RELIGIOUS",
    labelAr: "مشروع ديني",
    labelFr: "Projet religieux",
    labelEn: "Religious project",
    icon: "🕌",
    descAr: "بناء أو ترميم مسجد أو مدرسة قرآنية",
    descFr: "Construction ou rénovation de mosquée ou école coranique",
  },
  {
    value: "ASSOCIATION",
    labelAr: "جمعية خيرية",
    labelFr: "Association caritative",
    labelEn: "Charity association",
    icon: "🏛️",
    descAr: "مشروع جمعوي خيري",
    descFr: "Projet associatif caritatif",
  },
  {
    value: "HUMANITARIAN",
    labelAr: "إغاثة إنسانية",
    labelFr: "Aide humanitaire",
    labelEn: "Humanitarian relief",
    icon: "🌍",
    descAr: "إغاثة في مناطق الكوارث والأزمات",
    descFr: "Secours dans les zones de catastrophes et crises",
  },
  {
    value: "EDUCATION",
    labelAr: "تعليم وتكوين",
    labelFr: "Éducation et formation",
    labelEn: "Education & training",
    icon: "📚",
    descAr: "رسوم دراسية أو تكوين مهني",
    descFr: "Frais scolaires ou formation professionnelle",
  },
  {
    value: "FUNERAL",
    labelAr: "مساعدة جنائزية",
    labelFr: "Aide funéraire",
    labelEn: "Funeral aid",
    icon: "🕊️",
    descAr: "تكاليف الجنازة والدفن",
    descFr: "Frais funéraires et d'inhumation",
  },
];

export interface DocumentRequirement {
  category: DocumentCategory;
  labelAr: string;
  labelFr: string;
  required: boolean;
}

export const REQUIRED_DOCS: Record<RequestCategory, DocumentRequirement[]> = {
  MEDICAL: [
    { category: "MEDICAL_REPORT", labelAr: "تقرير طبي", labelFr: "Rapport médical", required: true },
    { category: "INVOICE", labelAr: "فاتورة أو عرض سعر", labelFr: "Devis médical", required: true },
    { category: "PHOTOS", labelAr: "صور داعمة", labelFr: "Photos justificatives", required: false },
  ],
  PERSONAL: [
    { category: "PROOF_OF_IDENTITY", labelAr: "وثيقة هوية", labelFr: "Pièce d'identité", required: true },
    { category: "INVOICE", labelAr: "فاتورة أو إثبات الحاجة", labelFr: "Facture ou justificatif", required: true },
    { category: "BANK_STATEMENT", labelAr: "كشف حساب بنكي", labelFr: "Relevé bancaire", required: false },
  ],
  RELIGIOUS: [
    { category: "INVOICE", labelAr: "عرض سعر المقاول", labelFr: "Devis entrepreneur", required: true },
    { category: "PHOTOS", labelAr: "صور الحالة الراهنة", labelFr: "Photos état actuel", required: true },
    { category: "OTHER", labelAr: "وثيقة ملكية أو موافقة", labelFr: "Titre de propriété ou autorisation", required: false },
  ],
  ASSOCIATION: [
    { category: "ASSOCIATION_DOCS", labelAr: "القانون الأساسي", labelFr: "Statuts association", required: true },
    { category: "ASSOCIATION_DOCS", labelAr: "رقم التسجيل", labelFr: "Numéro d'enregistrement", required: true },
    { category: "OTHER", labelAr: "تقرير النشاط السنوي", labelFr: "Rapport d'activité annuel", required: false },
  ],
  HUMANITARIAN: [
    { category: "PHOTOS", labelAr: "صور أو فيديو الوضع", labelFr: "Photos ou vidéo de la situation", required: true },
    { category: "OTHER", labelAr: "تقرير منظمة أو وثيقة رسمية", labelFr: "Rapport officiel", required: false },
  ],
  EDUCATION: [
    { category: "INVOICE", labelAr: "وثيقة قبول أو تسجيل", labelFr: "Attestation d'inscription", required: true },
    { category: "INVOICE", labelAr: "فاتورة الرسوم الدراسية", labelFr: "Facture frais scolaires", required: true },
  ],
  FUNERAL: [
    { category: "OTHER", labelAr: "شهادة الوفاة", labelFr: "Acte de décès", required: true },
    { category: "INVOICE", labelAr: "تكاليف الجنازة", labelFr: "Devis pompes funèbres", required: false },
  ],
};

export const COUNTRIES = [
  { code: "MA", labelAr: "المغرب", labelFr: "Maroc", flag: "🇲🇦" },
  { code: "DZ", labelAr: "الجزائر", labelFr: "Algérie", flag: "🇩🇿" },
  { code: "TN", labelAr: "تونس", labelFr: "Tunisie", flag: "🇹🇳" },
  { code: "EG", labelAr: "مصر", labelFr: "Égypte", flag: "🇪🇬" },
  { code: "FR", labelAr: "فرنسا", labelFr: "France", flag: "🇫🇷" },
  { code: "BE", labelAr: "بلجيكا", labelFr: "Belgique", flag: "🇧🇪" },
  { code: "DE", labelAr: "ألمانيا", labelFr: "Allemagne", flag: "🇩🇪" },
  { code: "NL", labelAr: "هولندا", labelFr: "Pays-Bas", flag: "🇳🇱" },
  { code: "GB", labelAr: "بريطانيا", labelFr: "Royaume-Uni", flag: "🇬🇧" },
  { code: "US", labelAr: "أمريكا", labelFr: "États-Unis", flag: "🇺🇸" },
  { code: "CA", labelAr: "كندا", labelFr: "Canada", flag: "🇨🇦" },
  { code: "TR", labelAr: "تركيا", labelFr: "Turquie", flag: "🇹🇷" },
  { code: "SA", labelAr: "السعودية", labelFr: "Arabie Saoudite", flag: "🇸🇦" },
  { code: "AE", labelAr: "الإمارات", labelFr: "Émirats", flag: "🇦🇪" },
  { code: "QA", labelAr: "قطر", labelFr: "Qatar", flag: "🇶🇦" },
  { code: "LB", labelAr: "لبنان", labelFr: "Liban", flag: "🇱🇧" },
  { code: "SN", labelAr: "السنغال", labelFr: "Sénégal", flag: "🇸🇳" },
  { code: "ML", labelAr: "مالي", labelFr: "Mali", flag: "🇲🇱" },
];
