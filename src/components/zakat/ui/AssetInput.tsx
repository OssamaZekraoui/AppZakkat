"use client";

interface AssetInputProps {
  label: string;
  labelAr?: string;
  value: number;
  onChange: (value: number) => void;
  icon?: string;
  hint?: string;
  suffix?: string;
  locale: string;
  disabled?: boolean;
}

export default function AssetInput({
  label,
  labelAr,
  value,
  onChange,
  icon,
  hint,
  suffix,
  locale,
  disabled = false,
}: AssetInputProps) {
  const isAr = locale === "ar";

  return (
    <div className="group">
      <label className="block mb-1.5">
        <span className="font-cairo text-sm font-semibold text-green-deep flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          {isAr && labelAr ? labelAr : label}
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
          className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-lato text-lg
                     focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          dir="ltr"
        />
        {suffix && (
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-sm text-green-deep/50 font-cairo">
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
