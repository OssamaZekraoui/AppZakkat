import InformationPage from "@/components/legal/InformationPage";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw === "ar" || raw === "en" ? raw : "fr";
  const copy = locale === "ar" ? {
    eyebrow: "معلومات قانونية", title: "شروط الاستخدام", intro: "توضح هذه الصفحة قواعد استخدام منصة ضياء وخدماتها المجانية.", updated: "آخر تحديث: 5 أغسطس 2026",
    sections: [
      { title: "الغرض من المنصة", paragraphs: ["ضياء منصة غير ربحية لتسهيل طلبات المساعدة وحساب الزكاة والتبرعات المباشرة. لا تقدم المنصة فتوى شرعية أو استشارة مالية أو قانونية."] },
      { title: "حسابات المستخدمين", paragraphs: ["يجب تقديم معلومات صحيحة وحماية بيانات الدخول. يحتفظ الفريق بحق تعليق الحسابات عند إساءة الاستخدام أو الاحتيال."] },
      { title: "طلبات المساعدة", paragraphs: ["تخضع الطلبات للمراجعة قبل النشر. لا يضمن إرسال الطلب قبوله أو تمويله، ويظل مقدم الطلب مسؤولاً عن صحة الوثائق المقدمة."] },
      { title: "التبرعات", paragraphs: ["التحويلات إلى المستفيدين تتم مباشرة. يجب على المتبرع التحقق من المرجع والمبلغ قبل تأكيد التحويل."] },
    ],
  } : locale === "en" ? {
    eyebrow: "Legal information", title: "Terms of service", intro: "These terms explain the rules for using the Diyae platform and its free services.", updated: "Last updated: August 5, 2026",
    sections: [
      { title: "Purpose", paragraphs: ["Diyae is a non-profit platform facilitating aid requests, Zakat calculations and direct donations. It does not provide religious rulings, financial advice or legal advice."] },
      { title: "User accounts", paragraphs: ["Users must provide accurate information and protect their credentials. The team may suspend accounts involved in abuse or fraud."] },
      { title: "Aid requests", paragraphs: ["Requests are reviewed before publication. Submission does not guarantee approval or funding, and applicants remain responsible for their documents."] },
      { title: "Donations", paragraphs: ["Transfers to beneficiaries are made directly. Donors must verify the reference and amount before confirming a transfer."] },
    ],
  } : {
    eyebrow: "Informations légales", title: "Conditions d’utilisation", intro: "Ces conditions présentent les règles applicables à l’utilisation de Diyae et de ses services gratuits.", updated: "Dernière mise à jour : 5 août 2026",
    sections: [
      { title: "Objet de la plateforme", paragraphs: ["Diyae est une plateforme à but non lucratif facilitant les demandes d’aide, le calcul de la Zakat et les dons directs. Elle ne fournit ni fatwa, ni conseil financier ou juridique."] },
      { title: "Comptes utilisateurs", paragraphs: ["Les utilisateurs doivent fournir des informations exactes et protéger leurs identifiants. L’équipe peut suspendre les comptes impliqués dans un abus ou une fraude."] },
      { title: "Demandes d’aide", paragraphs: ["Les demandes sont examinées avant publication. Leur soumission ne garantit ni leur acceptation ni leur financement. Le demandeur reste responsable de l’authenticité des documents transmis."] },
      { title: "Dons", paragraphs: ["Les virements aux bénéficiaires sont réalisés directement. Le donateur doit vérifier la référence et le montant avant de confirmer son transfert."] },
    ],
  };
  return <InformationPage locale={locale} {...copy} />;
}
