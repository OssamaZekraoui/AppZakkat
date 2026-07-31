"use client";

import { useState } from "react";
import type { NisabType } from "@/lib/zakat/types";

const COPY = {
  ar: {
    title: "إعداد النصاب",
    description: "اختر مرجع النصاب المطبق على جميع حسابات الزكاة.",
    gold: "الذهب (85 غرام)",
    silver: "الفضة (595 غرام)",
    save: "حفظ الاختيار",
    saving: "جارٍ الحفظ...",
    saved: "تم تحديث النصاب بنجاح.",
    error: "تعذر حفظ الإعداد.",
  },
  fr: {
    title: "Réglage du nissab",
    description: "Choisissez le référentiel appliqué à tous les calculs de Zakat.",
    gold: "Or (85 grammes)",
    silver: "Argent (7 438 DH / 595 grammes)",
    save: "Enregistrer le choix",
    saving: "Enregistrement...",
    saved: "Le nissab a été mis à jour.",
    error: "Impossible d’enregistrer le réglage.",
  },
  en: {
    title: "Nisab setting",
    description: "Choose the reference applied to every Zakat calculation.",
    gold: "Gold (85 grams)",
    silver: "Silver (MAD 7,438 / 595 grams)",
    save: "Save selection",
    saving: "Saving...",
    saved: "The nisab setting has been updated.",
    error: "Unable to save the setting.",
  },
} as const;

export default function NisabSettings({
  initialValue,
  locale,
}: {
  initialValue: NisabType;
  locale: "ar" | "fr" | "en";
}) {
  const t = COPY[locale];
  const [value, setValue] = useState<NisabType>(initialValue);
  const [savedValue, setSavedValue] = useState<NisabType>(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setStatus("saving");
    try {
      const response = await fetch("/api/admin/settings/nisab", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nisabType: value }),
      });
      if (!response.ok) throw new Error("Save failed");
      setSavedValue(value);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="rounded-2xl border border-green-deep/10 bg-white p-6 shadow-sm">
      <h2 className="font-amiri text-2xl font-bold text-green-deep">{t.title}</h2>
      <p className="mt-1 font-cairo text-sm text-green-deep/60">{t.description}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {(["gold", "silver"] as const).map((type) => (
          <label
            key={type}
            className={`cursor-pointer rounded-xl border-2 p-4 font-cairo transition-colors ${
              value === type
                ? "border-gold bg-gold/10 text-green-deep"
                : "border-green-deep/10 text-green-deep/65 hover:border-green-deep/25"
            }`}
          >
            <input
              type="radio"
              name="nisabType"
              value={type}
              checked={value === type}
              onChange={() => {
                setValue(type);
                setStatus("idle");
              }}
              className="me-3 accent-[#c9a227]"
            />
            {type === "gold" ? t.gold : t.silver}
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving" || value === savedValue}
          className="cursor-pointer rounded-xl bg-green-deep px-5 py-2.5 font-cairo font-bold text-white transition-colors hover:bg-green-deep/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving" ? t.saving : t.save}
        </button>
        {status === "saved" && <p className="font-cairo text-sm text-green-700">{t.saved}</p>}
        {status === "error" && <p className="font-cairo text-sm text-red-600">{t.error}</p>}
      </div>
    </section>
  );
}
