"use client";

import type { ZakatSchool } from "@/lib/zakat/types";

interface SchoolOption {
  value: ZakatSchool;
  labelAr: string;
  labelFr: string;
  descAr: string;
  descFr: string;
}

const SCHOOLS: SchoolOption[] = [
  {
    value: "maliki",
    labelAr: "مالكي",
    labelFr: "Malikite",
    descAr: "مذهب المغرب وأفريقيا",
    descFr: "Madhab du Maghreb et de l'Afrique",
  },
  {
    value: "hanafi",
    labelAr: "حنفي",
    labelFr: "Hanafite",
    descAr: "نصاب الفضة — أيسر للفقراء",
    descFr: "Nisab argent — plus accessible",
  },
  {
    value: "shafiite",
    labelAr: "شافعي",
    labelFr: "Chaféite",
    descAr: "نصاب الذهب — المذهب الأوسع",
    descFr: "Nisab or — madhab majoritaire",
  },
  {
    value: "hanbalite",
    labelAr: "حنبلي",
    labelFr: "Hanbalite",
    descAr: "المذهب المحافظ — الجزيرة العربية",
    descFr: "Madhab conservateur — Arabie",
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
  const isAr = locale === "ar";

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
                  isSelected
                    ? "border-gold"
                    : "border-green-deep/30"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-gold" />
                )}
              </div>
              <span className="font-cairo font-bold text-green-deep">
                {isAr ? school.labelAr : school.labelFr}
              </span>
            </div>
            <p className="text-xs text-green-deep/50 font-cairo ps-6">
              {isAr ? school.descAr : school.descFr}
            </p>
          </button>
        );
      })}
    </div>
  );
}
