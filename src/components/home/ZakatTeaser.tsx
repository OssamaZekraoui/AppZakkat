"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";

const GOLD_PRICE_DEFAULT = 850; // MAD per gram (approximate)
const SILVER_PRICE_DEFAULT = 10; // MAD per gram (approximate)
const ZAKAT_RATE = 0.025;
const GOLD_NISAB_GRAMS = 85;

export default function ZakatTeaser() {
  const t = useTranslations("zakatTeaser");
  const [cash, setCash] = useState("");
  const [gold, setGold] = useState("");
  const [silver, setSilver] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const cashVal = parseFloat(cash) || 0;
    const goldVal = (parseFloat(gold) || 0) * GOLD_PRICE_DEFAULT;
    const silverVal = (parseFloat(silver) || 0) * SILVER_PRICE_DEFAULT;
    const total = cashVal + goldVal + silverVal;
    const nisab = GOLD_NISAB_GRAMS * GOLD_PRICE_DEFAULT;

    if (total >= nisab) {
      setResult(total * ZAKAT_RATE);
    } else {
      setResult(0);
    }
  };

  return (
    <section id="zakat" className="py-16 sm:py-24 px-4 bg-gradient-to-br from-green-deep to-green-medium relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: Info */}
          <div className="text-white">
            <h2 className="font-amiri text-3xl sm:text-4xl font-bold mb-4">
              {t("title")}
            </h2>
            <p className="font-cairo text-white/80 text-lg mb-6 leading-relaxed">
              {t("description")}
            </p>

            <ul className="space-y-3 mb-8">
              {(["bullet1", "bullet2", "bullet3", "bullet4", "bullet5"] as const).map(
                (key) => (
                  <li key={key} className="flex items-start gap-3">
                    <span className="text-gold mt-1">✦</span>
                    <span className="font-cairo text-white/80 text-sm">
                      {t(key)}
                    </span>
                  </li>
                )
              )}
            </ul>

            <Link
              href="/zakat"
              className="inline-block px-8 py-3 bg-gold hover:bg-gold-light text-green-deep font-cairo font-bold rounded-xl transition-all min-h-[44px]"
            >
              {t("fullCalculator")}
            </Link>
          </div>

          {/* Right: Quick calc widget */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8">
            <h3 className="text-gold font-cairo font-bold text-xl mb-6 text-center">
              {t("quickCalcTitle")}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 font-cairo text-sm mb-1">
                  {t("cash")}
                </label>
                <input
                  type="number"
                  value={cash}
                  onChange={(e) => setCash(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-lato placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-cairo text-sm mb-1">
                  {t("gold")}
                </label>
                <input
                  type="number"
                  value={gold}
                  onChange={(e) => setGold(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-lato placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-white/70 font-cairo text-sm mb-1">
                  {t("silver")}
                </label>
                <input
                  type="number"
                  value={silver}
                  onChange={(e) => setSilver(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-lato placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors min-h-[44px]"
                />
              </div>

              <button
                onClick={handleCalculate}
                className="w-full py-3 bg-gold hover:bg-gold-light text-green-deep font-cairo font-bold rounded-xl transition-all min-h-[44px]"
              >
                {t("calculate")}
              </button>

              {result !== null && (
                <div className="mt-4 bg-white/10 rounded-xl p-4 text-center border border-gold/30">
                  <p className="text-white/60 font-cairo text-sm mb-1">
                    {t("result")}
                  </p>
                  <p className="text-gold font-lato font-bold text-3xl">
                    {result.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p className="text-white/40 font-cairo text-xs mt-1">MAD</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
