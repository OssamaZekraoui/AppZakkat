"use client";

import { useState, useCallback } from "react";

interface IBANInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  locale: string;
}

function formatIBAN(raw: string): string {
  const clean = raw.replace(/\s/g, "").toUpperCase();
  return clean.replace(/(.{4})/g, "$1 ").trim();
}

function validateIBANChecksum(iban: string): boolean {
  const clean = iban.replace(/\s/g, "");
  if (clean.length < 15) return false;

  // Move first 4 chars to end
  const rearranged = clean.slice(4) + clean.slice(0, 4);

  // Convert letters to numbers (A=10, B=11, ..., Z=35)
  let numericStr = "";
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      numericStr += (code - 55).toString();
    } else {
      numericStr += ch;
    }
  }

  // Mod 97 check
  let remainder = 0;
  for (const digit of numericStr) {
    remainder = (remainder * 10 + parseInt(digit)) % 97;
  }
  return remainder === 1;
}

function getCountryFromIBAN(iban: string): string {
  const clean = iban.replace(/\s/g, "");
  if (clean.length >= 2) return clean.slice(0, 2);
  return "";
}

// Known IBAN lengths by country
const IBAN_LENGTHS: Record<string, number> = {
  MA: 28, FR: 27, DE: 22, BE: 16, NL: 18, ES: 24,
  IT: 27, GB: 22, SA: 24, AE: 23, TN: 24, DZ: 26,
  TR: 26, EG: 29, QA: 29, LB: 28, SN: 28,
};

export default function IBANInput({
  value,
  onChange,
  error,
  locale,
}: IBANInputProps) {
  const isAr = locale === "ar";
  const [touched, setTouched] = useState(false);

  const clean = value.replace(/\s/g, "").toUpperCase();
  const country = getCountryFromIBAN(clean);
  const expectedLength = IBAN_LENGTHS[country];
  const lengthOk = expectedLength ? clean.length === expectedLength : clean.length >= 15;
  const checksumOk = clean.length >= 15 && validateIBANChecksum(clean);
  const isValid = lengthOk && checksumOk;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase();
      const cleaned = raw.replace(/\s/g, "");
      onChange(cleaned);
    },
    [onChange]
  );

  return (
    <div>
      <label className="block font-cairo font-semibold text-green-deep text-sm mb-1.5">
        IBAN
      </label>
      <div className="relative">
        <input
          type="text"
          value={formatIBAN(value)}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="MA64 0111 0000 0000 0000 0000 00"
          className={`w-full px-4 py-3 rounded-xl border-2 bg-white font-lato text-lg tracking-wider
                      outline-none transition-all
                      [letter-spacing:0.1em]
                      ${
                        touched && !isValid && clean.length > 4
                          ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                          : isValid
                          ? "border-green-medium focus:border-green-medium focus:ring-2 focus:ring-green-pale"
                          : "border-green-deep/10 focus:border-gold focus:ring-2 focus:ring-gold/20"
                      }`}
          dir="ltr"
        />
        {/* Status indicator */}
        {clean.length > 4 && (
          <span className="absolute end-3 top-1/2 -translate-y-1/2 text-lg">
            {isValid ? (
              <span className="text-green-medium">✓</span>
            ) : touched ? (
              <span className="text-red-400">✗</span>
            ) : null}
          </span>
        )}
      </div>

      {/* Info line */}
      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {country && (
            <span className="text-xs font-lato text-green-deep/40">
              {isAr ? "البلد" : "Pays"}: {country}
            </span>
          )}
          {expectedLength && (
            <span className="text-xs font-lato text-green-deep/40">
              ({clean.length}/{expectedLength})
            </span>
          )}
        </div>
        {isValid && (
          <span className="text-xs font-cairo text-green-medium font-bold">
            {isAr ? "✓ IBAN صالح" : "✓ IBAN valide"}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-500 font-cairo">{error}</p>
      )}
    </div>
  );
}
