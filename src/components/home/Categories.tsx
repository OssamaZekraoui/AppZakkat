"use client";

import { useTranslations } from "next-intl";

const categories = [
  { icon: "🌙", key: "zakat" },
  { icon: "🤝", key: "personal" },
  { icon: "🏥", key: "medical" },
  { icon: "🕌", key: "religious" },
  { icon: "🫶", key: "association" },
  { icon: "🌍", key: "humanitarian" },
  { icon: "📚", key: "education" },
  { icon: "🕊️", key: "funeral" },
  { icon: "🌙", key: "eid" },
  { icon: "👶", key: "orphans" },
] as const;

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
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
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
