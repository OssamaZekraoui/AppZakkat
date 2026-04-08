"use client";

import type { RequestCategory } from "@/types/demandes";
import { CATEGORIES } from "@/types/demandes";
import CategoryCard from "../ui/CategoryCard";

interface Step0Props {
  value: RequestCategory;
  onChange: (category: RequestCategory) => void;
  locale: string;
}

export default function Step0Category({ value, onChange, locale }: Step0Props) {
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-amiri text-2xl md:text-3xl font-bold text-green-deep mb-2">
          {isAr ? "اختر فئة طلبك" : "Choisissez la catégorie"}
        </h2>
        <p className="font-cairo text-sm text-green-deep/50">
          {isAr
            ? "حدد نوع المساعدة التي تحتاجها"
            : "Sélectionnez le type d'aide dont vous avez besoin"}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat) => (
          <CategoryCard
            key={cat.value}
            category={cat}
            selected={value === cat.value}
            onSelect={() => onChange(cat.value)}
            locale={locale}
          />
        ))}
      </div>

      <div className="bg-green-pale/20 rounded-xl p-4 text-center">
        <p className="font-cairo text-xs text-green-deep/50">
          {isAr
            ? "جميع الطلبات تخضع للمراجعة قبل النشر — يُرجى تقديم وثائق داعمة حقيقية"
            : "Toutes les demandes sont vérifiées avant publication — veuillez fournir des documents authentiques"}
        </p>
      </div>
    </div>
  );
}
