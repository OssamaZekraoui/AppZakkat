import InformationPage from "@/components/legal/InformationPage";

export default async function TransparencyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = raw === "ar" || raw === "en" ? raw : "fr";
  const copy = locale === "ar" ? {
    eyebrow: "الشفافية", title: "تقارير ضياء المالية", intro: "نميز بوضوح بين التبرعات المباشرة للمستفيدين وتكاليف تشغيل المنصة.", updated: "آخر تحديث: 5 أغسطس 2026",
    sections: [
      { id: "rapport-annuel", title: "التقرير السنوي 2026", paragraphs: ["المنصة في مرحلة الإطلاق. سيُنشر أول تقرير سنوي كامل بعد إغلاق السنة المالية 2026. لن نعرض أرقاماً تقديرية على أنها نتائج مدققة."] },
      { id: "etats-financiers", title: "البيانات المالية", paragraphs: ["التكلفة التشغيلية المستهدفة تقارب 80 يورو شهرياً للاستضافة والنطاق والخدمات التقنية. يعمل الفريق تطوعياً دون رواتب من تبرعات المنصة."] },
      { title: "التبرعات للمستفيدين", paragraphs: ["التبرعات للقضايا لا تمر عبر حساب تشغيل ضياء؛ يتم التحويل مباشرة إلى الحساب المخصص للمستفيد وفق المعلومات المنشورة للقضية."] },
    ],
  } : locale === "en" ? {
    eyebrow: "Transparency", title: "Diyae financial reporting", intro: "We clearly distinguish direct beneficiary donations from the platform’s operating costs.", updated: "Last updated: August 5, 2026",
    sections: [
      { id: "rapport-annuel", title: "2026 annual report", paragraphs: ["The platform is in its launch phase. The first complete annual report will be published after the 2026 financial year closes. Estimates will not be presented as audited results."] },
      { id: "etats-financiers", title: "Financial statements", paragraphs: ["Target operating costs are approximately €80 per month for hosting, domain and technical services. The team is volunteer-run and receives no salary from platform support donations."] },
      { title: "Beneficiary donations", paragraphs: ["Cause donations do not pass through Diyae’s operating account; transfers are made directly to the beneficiary account identified for the approved cause."] },
    ],
  } : {
    eyebrow: "Transparence", title: "Rapports financiers de Diyae", intro: "Nous distinguons clairement les dons directs aux bénéficiaires des frais nécessaires au fonctionnement de la plateforme.", updated: "Dernière mise à jour : 5 août 2026",
    sections: [
      { id: "rapport-annuel", title: "Rapport annuel 2026", paragraphs: ["La plateforme est en phase de lancement. Le premier rapport annuel complet sera publié après la clôture de l’exercice 2026. Les estimations ne seront pas présentées comme des résultats audités."] },
      { id: "etats-financiers", title: "États financiers", paragraphs: ["Les coûts de fonctionnement visés sont d’environ 80 € par mois pour l’hébergement, le domaine et les services techniques. L’équipe est bénévole et ne reçoit aucun salaire provenant des dons de soutien au site."] },
      { title: "Dons aux bénéficiaires", paragraphs: ["Les dons destinés aux causes ne transitent pas par le compte de fonctionnement de Diyae : les virements sont réalisés directement vers le compte du bénéficiaire associé à la cause approuvée."] },
    ],
  };
  return <InformationPage locale={locale} {...copy} />;
}
