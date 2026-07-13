"use client";

import type { ZakatSchool } from "@/lib/zakat/types";
import { pickText } from "../zakatText";

interface SchoolOption {
  value: ZakatSchool;
  label: { ar: string; fr: string; en: string };
  desc: { ar: string; fr: string; en: string };
}

const SCHOOLS: SchoolOption[] = [
  {
    value: "maliki",
    label: { ar: "مالكي", fr: "Malikite", en: "Maliki" },
    desc: {
      ar: "مذهب المغرب وإفريقيا",
      fr: "Madhab du Maghreb et de l'Afrique",
      en: "School common in the Maghreb and Africa",
    },
  },
  {
    value: "hanafi",
    label: { ar: "حنفي", fr: "Hanafite", en: "Hanafi" },
    desc: {
      ar: "نصاب الفضة — أيسر للفقراء",
      fr: "Nisab argent — plus accessible",
      en: "Silver nisab — more accessible",
    },
  },
  {
    value: "shafiite",
    label: { ar: "شافعي", fr: "Chaféite", en: "Shafi'i" },
    desc: {
      ar: "نصاب الذهب — المذهب الأوسع",
      fr: "Nisab or — madhab majoritaire",
      en: "Gold nisab — widely followed",
    },
  },
  {
    value: "hanbalite",
    label: { ar: "حنبلي", fr: "Hanbalite", en: "Hanbali" },
    desc: {
      ar: "المذهب المحافظ — الجزيرة العربية",
      fr: "Madhab conservateur — Arabie",
      en: "Conservative school — Arabian Peninsula",
    },
  },
];

interface SchoolSelectorProps {
  value: ZakatSchool;
  onChange: (school: ZakatSchool) => void;
  locale: string;
}

export default function SchoolSelector({
  value,
  onChange,
  locale,
}: SchoolSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SCHOOLS.map((school) => {
        const isSelected = value === school.value;
        return (
          <button
            key={school.value}
            onClick={() => onChange(school.value)}
            className={`text-start p-4 rounded-xl border-2 transition-all duration-200 ${
              isSelected
                ? "border-gold bg-gold/5 shadow-md"
                : "border-green-deep/10 bg-white hover:border-green-deep/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-gold" : "border-green-deep/30"
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-gold" />}
              </div>
              <span className="font-cairo font-bold text-green-deep">
                {pickText(locale, school.label)}
              </span>
            </div>
            <p className="text-xs text-green-deep/50 font-cairo ps-6">
              {pickText(locale, school.desc)}
            </p>
          </button>
        );
      })}
    </div>
  );
}
