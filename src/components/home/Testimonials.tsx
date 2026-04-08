"use client";

import { useTranslations } from "next-intl";

const testimonials = [
  { nameKey: "t1Name", textKey: "t1Text", locationKey: "t1Location", avatar: "أ" },
  { nameKey: "t2Name", textKey: "t2Text", locationKey: "t2Location", avatar: "ي" },
  { nameKey: "t3Name", textKey: "t3Text", locationKey: "t3Location", avatar: "ن" },
] as const;

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="py-16 sm:py-24 px-4 bg-white-off">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-green-deep font-amiri text-3xl sm:text-4xl font-bold text-center mb-12">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.nameKey}
              className="bg-white rounded-2xl p-6 shadow-sm border border-green-pale/30"
            >
              {/* Quote */}
              <div className="text-gold text-4xl font-amiri mb-2">&ldquo;</div>
              <p className="text-gray-600 font-cairo text-sm leading-relaxed mb-4">
                {t(item.textKey)}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-green-pale/30">
                <div className="w-10 h-10 rounded-full bg-green-pale flex items-center justify-center">
                  <span className="text-green-deep font-amiri font-bold">
                    {item.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-green-deep font-cairo font-bold text-sm">
                    {t(item.nameKey)}
                  </p>
                  <p className="text-gray-400 font-cairo text-xs">
                    {t(item.locationKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
