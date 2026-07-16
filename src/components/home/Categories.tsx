"use client";

import { useTranslations } from "next-intl";
import AppIcon, { type AppIconName } from "@/components/ui/AppIcon";

const categories: { icon: AppIconName; key: string }[] = [
  { icon: "moon", key: "zakat" },
  { icon: "hand-heart", key: "personal" },
  { icon: "medical", key: "medical" },
  { icon: "landmark", key: "religious" },
  { icon: "users", key: "association" },
  { icon: "earth", key: "humanitarian" },
  { icon: "education", key: "education" },
  { icon: "feather", key: "funeral" },
  { icon: "sparkles", key: "eid" },
  { icon: "baby", key: "orphans" },
];

export default function Categories() {
  const t = useTranslations("categories");

  return (
    <section className="py-16 px-4 bg-white-off">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-green-deep font-amiri text-3xl sm:text-4xl font-bold text-center mb-10">
          {t("title")}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-transparent hover:border-gold/40 text-center cursor-pointer"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-pale/60 text-green-deep transition-colors duration-200 group-hover:bg-gold/20 group-hover:text-gold">
                <AppIcon name={cat.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-green-deep font-cairo font-bold text-sm sm:text-base">
                {t(cat.key)}
              </h3>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
