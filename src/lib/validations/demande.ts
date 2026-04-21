import { z } from "zod";

export const step0Schema = z.object({
  category: z.enum([
    "PERSONAL",
    "MEDICAL",
    "RELIGIOUS",
    "ASSOCIATION",
    "HUMANITARIAN",
    "EDUCATION",
    "FUNERAL",
    "EID",
    "ORPHANS",
  ]),
});

export const step1Schema = z.object({
  displayName: z.string().min(2, "الاسم قصير جداً").max(60),
  isAnonymous: z.boolean(),
  country: z.string().length(2, "اختر البلد"),
  city: z.string().min(2, "أدخل المدينة").max(60),
  contactEmail: z.string().email("بريد إلكتروني غير صالح"),
  contactPhone: z.string().optional(),
});

export const step2Schema = z.object({
  titleAr: z.string().min(10, "العنوان قصير جداً (10 أحرف على الأقل)").max(100),
  titleFr: z.string().max(100).optional().or(z.literal("")),
  descriptionAr: z
    .string()
    .min(150, "الوصف قصير جداً (150 حرفاً على الأقل)")
    .max(2000),
  descriptionFr: z.string().max(2000).optional().or(z.literal("")),
  urgencyLevel: z.enum(["NORMAL", "URGENT", "CRITICAL"]),
});

export const step3Schema = z.object({
  targetAmount: z.number().min(100, "الحد الأدنى 100").max(1000000),
  currency: z.enum(["MAD", "EUR", "USD", "GBP"]),
  deadline: z.string().nullable(),
  breakdown: z
    .array(
      z.object({
        label: z.string().min(2),
        amount: z.number().positive(),
      })
    )
    .min(1, "أضف بنداً واحداً على الأقل"),
});

export const step4Schema = z.object({
  beneficiaryName: z.string().min(3, "اسم صاحب الحساب مطلوب").max(100),
  iban: z
    .string()
    .min(15, "IBAN غير صالح")
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/, "صيغة IBAN غير صحيحة"),
  bic: z
    .string()
    .regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "صيغة BIC غير صحيحة"),
  bankName: z.string().min(2, "اسم البنك مطلوب"),
  bankCountry: z.string().length(2),
});

export const step5Schema = z.object({
  documents: z
    .array(
      z.object({
        id: z.string(),
        filename: z.string(),
        originalName: z.string(),
        url: z.string(),
        size: z.number().max(5 * 1024 * 1024, "حجم الملف يتجاوز 5MB"),
        mimeType: z.string(),
        category: z.enum([
          "MEDICAL_REPORT",
          "INVOICE",
          "PROOF_OF_IDENTITY",
          "BANK_STATEMENT",
          "ASSOCIATION_DOCS",
          "PHOTOS",
          "OTHER",
        ]),
      })
    )
    .min(1, "أرفق وثيقة واحدة على الأقل"),
});

export const step6Schema = z.object({
  declarationAccepted: z.literal(true, {
    message: "يجب الموافقة على الشروط",
  }),
  honorAccepted: z.literal(true, {
    message: "يجب التصريح على الشرف",
  }),
});

export const fullRequestSchema = step0Schema
  .merge(step1Schema)
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema)
  .merge(step6Schema);

export const STEP_SCHEMAS = [
  step0Schema,
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
  step6Schema,
] as const;

export function validateStep(
  step: number,
  data: Record<string, unknown>
): { success: boolean; errors: Record<string, string> } {
  const schema = STEP_SCHEMAS[step];
  if (!schema) return { success: true, errors: {} };

  const result = schema.safeParse(data);
  if (result.success) return { success: true, errors: {} };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    errors[key] = issue.message;
  }
  return { success: false, errors };
}
