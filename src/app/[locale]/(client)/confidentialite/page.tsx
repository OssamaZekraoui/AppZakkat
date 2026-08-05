import InformationPage from "@/components/legal/InformationPage";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw === "ar" || raw === "en" ? raw : "fr";
  const copy = locale === "ar" ? {
    eyebrow: "حماية البيانات", title: "سياسة الخصوصية", intro: "نوضح هنا البيانات التي تعالجها ضياء وأسباب استخدامها وحقوق المستخدم.", updated: "آخر تحديث: 5 أغسطس 2026",
    sections: [
      { title: "البيانات المعالجة", paragraphs: ["نعالج بيانات الحساب وطلبات المساعدة والوثائق الضرورية للمراجعة ونتائج حساب الزكاة المحفوظة بطلب المستخدم."] },
      { title: "الغرض والحماية", paragraphs: ["تستخدم البيانات لتشغيل الحساب ومراجعة الطلب ومنع الاحتيال. لا تباع البيانات الشخصية لأطراف أخرى."] },
      { title: "النشر", paragraphs: ["لا تنشر الوثائق الإدارية أو الطبية. تعرض الصفحة العامة فقط المعلومات اللازمة لفهم القضية بعد الموافقة عليها."] },
      { title: "حقوقك والاتصال", paragraphs: ["يمكن طلب الوصول أو التصحيح أو الحذف عبر ossama.zekaroui@gmail.com، مع مراعاة الالتزامات القانونية ومكافحة الاحتيال."] },
    ],
  } : locale === "en" ? {
    eyebrow: "Data protection", title: "Privacy policy", intro: "This page explains what Diyae processes, why it is used and the rights available to users.", updated: "Last updated: August 5, 2026",
    sections: [
      { title: "Data processed", paragraphs: ["We process account data, aid request information, documents required for review and Zakat calculations saved at the user’s request."] },
      { title: "Purpose and protection", paragraphs: ["Data is used to operate accounts, review requests and prevent fraud. Personal data is not sold to third parties."] },
      { title: "Publication", paragraphs: ["Administrative and medical documents are not intended for public publication. Public pages should contain only information needed to understand an approved cause."] },
      { title: "Your rights and contact", paragraphs: ["Access, correction or deletion requests can be sent to ossama.zekaroui@gmail.com, subject to legal and anti-fraud obligations."] },
    ],
  } : {
    eyebrow: "Protection des données", title: "Politique de confidentialité", intro: "Cette page explique les données traitées par Diyae, leur utilisation et les droits des utilisateurs.", updated: "Dernière mise à jour : 5 août 2026",
    sections: [
      { title: "Données traitées", paragraphs: ["Nous traitons les données de compte, les informations des demandes d’aide, les justificatifs nécessaires à leur examen et les calculs de Zakat enregistrés à la demande de l’utilisateur."] },
      { title: "Finalités et protection", paragraphs: ["Les données servent à gérer les comptes, examiner les demandes et prévenir la fraude. Les données personnelles ne sont pas vendues à des tiers."] },
      { title: "Publication", paragraphs: ["Les documents administratifs ou médicaux n’ont pas vocation à être publiés. Une page publique doit contenir uniquement les informations nécessaires à la compréhension d’une cause approuvée."] },
      { title: "Vos droits et contact", paragraphs: ["Toute demande d’accès, de correction ou de suppression peut être envoyée à ossama.zekaroui@gmail.com, sous réserve des obligations légales et de lutte contre la fraude."] },
    ],
  };
  return <InformationPage locale={locale} {...copy} />;
}
