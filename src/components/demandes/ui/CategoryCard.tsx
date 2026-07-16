"use client";

import type { CategoryInfo } from "@/types/demandes";
import AppIcon from "@/components/ui/AppIcon";

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
          <AppIcon name="check" className="h-4 w-4 text-green-deep" strokeWidth={2.5} />
        </div>
      )}

      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-green-pale/60 text-green-deep">
        <AppIcon name={category.icon} className="h-6 w-6" />
      </div>
      <h3 className="font-cairo font-bold text-green-deep text-sm mb-1">
        {isAr ? category.labelAr : category.labelFr}
      </h3>
      <p className="font-cairo text-xs text-green-deep/50 leading-relaxed">
        {isAr ? category.descAr : category.descFr}
      </p>
    </button>
  );
}
