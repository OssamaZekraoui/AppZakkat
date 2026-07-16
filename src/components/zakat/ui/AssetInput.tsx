"use client";

import { pickText } from "../zakatText";
import AppIcon, { type AppIconName } from "@/components/ui/AppIcon";

interface AssetInputProps {
  label: string;
  labelAr?: string;
  labelFr?: string;
  value: number;
  onChange: (value: number) => void;
  icon?: AppIconName;
  hint?: string;
  suffix?: string;
  locale: string;
  disabled?: boolean;
}

export default function AssetInput({
  label,
  labelAr,
  labelFr,
  value,
  onChange,
  icon,
  hint,
  suffix,
  locale,
  disabled = false,
}: AssetInputProps) {
  const displayLabel = pickText(locale, {
    ar: labelAr || label,
    fr: labelFr || label,
    en: label,
  });

  return (
    <div className="group">
      <label className="block mb-1.5">
        <span className="font-cairo text-sm font-semibold text-green-deep flex items-center gap-2">
          {icon && (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-pale/60 text-green-deep">
              <AppIcon name={icon} className="h-4 w-4" />
            </span>
          )}
          {displayLabel}
        </span>
      </label>
      <div className="relative">
        <input
          type="number"
          min={0}
          step="0.01"
          value={value || ""}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          disabled={disabled}
          className={`w-full py-3 rounded-xl border-2 border-green-deep/10 bg-white font-lato text-lg text-left
                     focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                     ${suffix ? "pl-4 pr-20" : "px-4"}`}
          dir="ltr"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-green-deep/50 font-cairo pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {hint && (
        <p className="mt-1 text-xs text-green-deep/50 font-cairo">{hint}</p>
      )}
    </div>
  );
}
