"use client";

import type { CategoryInfo } from "@/types/demandes";

interface CategoryCardProps {
  category: CategoryInfo;
  selected: boolean;
  onSelect: () => void;
  locale: string;
}

export default function CategoryCard({
  category,
  selected,
  onSelect,
  locale,
}: CategoryCardProps) {
  const isAr = locale === "ar";

  return (
    <button
      onClick={onSelect}
      className={`relative text-start p-5 rounded-2xl border-2 transition-all duration-200 group ${
        selected
          ? "border-green-deep bg-green-pale/30 shadow-md"
          : "border-green-deep/10 bg-white hover:border-green-medium/30 hover:shadow-sm hover:-translate-y-0.5"
      }`}
    >
      {/* Check mark */}
      {selected && (
        <div className="absolute top-3 end-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
          <span className="text-green-deep text-sm font-bold">✓</span>
        </div>
      )}

      <div className="text-3xl mb-3">{category.icon}</div>
      <h3 className="font-cairo font-bold text-green-deep text-sm mb-1">
        {isAr ? category.labelAr : category.labelFr}
      </h3>
      <p className="font-cairo text-xs text-green-deep/50 leading-relaxed">
        {isAr ? category.descAr : category.descFr}
      </p>
    </button>
  );
}
