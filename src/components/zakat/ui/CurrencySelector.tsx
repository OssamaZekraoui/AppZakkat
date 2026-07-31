"use client";

import type { Currency } from "@/lib/zakat/types";

const CURRENCIES: { value: Currency; label: string; flag: string }[] = [
  { value: "MAD", label: "MAD", flag: "🇲🇦" },
  { value: "EUR", label: "EUR", flag: "🇪🇺" },
  { value: "USD", label: "USD", flag: "🇺🇸" },
  { value: "GBP", label: "GBP", flag: "🇬🇧" },
];

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export default function CurrencySelector({
  value,
  onChange,
}: CurrencySelectorProps) {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
      {CURRENCIES.map((c) => {
        const isSelected = value === c.value;
        return (
          <button
            type="button"
            key={c.value}
            onClick={() => onChange(c.value)}
            className={`flex min-w-0 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-bold transition-all ${
              isSelected
                ? "bg-gold text-green-deep shadow-md"
                : "bg-white text-green-deep/60 border border-green-deep/10 hover:border-green-deep/20"
            }`}
          >
            <span>{c.flag}</span>
            <span className="font-lato">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
