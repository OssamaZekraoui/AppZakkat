"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import AppIcon from "@/components/ui/AppIcon";

const presetAmounts = [3, 5, 10, 20];

export default function SiteDonation() {
  const t = useTranslations("siteDonation");
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState("");
  const [showModal, setShowModal] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  return (
    <>
      <section
        id="support-site"
        className="py-16 sm:py-24 px-4 bg-cream border-t-4 border-b-4 border-gold/40"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold/20 px-4 py-1.5 text-sm font-bold text-gold font-cairo">
            <AppIcon name="feather" className="h-4 w-4" />
            {t("badge")}
          </span>

          {/* Title */}
          <h2 className="text-green-deep font-amiri text-3xl sm:text-4xl font-bold mb-4">
            {t("title")}
          </h2>

          {/* Description */}
          <p className="text-gray-600 font-cairo text-lg mb-6 max-w-2xl mx-auto">
            {t("description")}
          </p>

          {/* Costs breakdown */}
          <div className="bg-white rounded-xl border border-gold/20 p-4 mb-6 max-w-md mx-auto">
            <p className="font-cairo text-green-deep font-bold text-sm mb-3">
              {t("costs")}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm font-cairo">
              <div className="flex justify-between">
                <span className="text-gray-500">{t("hosting")}</span>
                <span className="font-bold">40€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("domain")}</span>
                <span className="font-bold">15€</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("ssl")}</span>
                <span className="font-bold text-green-medium">{t("free")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">{t("volunteers")}</span>
                <span className="font-bold text-green-medium">0€</span>
              </div>
            </div>
          </div>

          {/* Transparency note */}
          <div className="bg-white border border-gold/30 rounded-xl p-4 mb-8 max-w-lg mx-auto">
            <p className="flex items-center justify-center gap-2 text-sm text-gray-600 font-cairo">
              <AppIcon name="sparkles" className="h-4 w-4 shrink-0 text-gold" />
              {t("transparencyNote")}
            </p>
          </div>

          {/* Amount selection */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`px-6 py-3 rounded-xl font-lato font-bold text-lg transition-all min-h-[44px] ${
                  selectedAmount === amount && !customAmount
                    ? "bg-gold text-green-deep shadow-md ring-2 ring-green-deep/15"
                    : "bg-white border border-gold/30 text-green-deep hover:border-gold"
                }`}
              >
                {amount}€
              </button>
            ))}
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={t("customAmount")}
              className="px-4 py-3 rounded-xl border border-gold/30 font-lato text-center w-32 focus:outline-none focus:border-gold min-h-[44px]"
            />
          </div>

          {/* Payment buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-green-deep hover:bg-green-medium text-white font-cairo font-bold rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-2"
            >
              <AppIcon name="card" className="h-5 w-5" />
              {t("cardPayment")}
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {t("secure")}
              </span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto px-8 py-4 bg-[#0070ba] hover:bg-[#005ea6] text-white font-cairo font-bold rounded-xl transition-all min-h-[44px] flex items-center justify-center gap-2"
            >
              {t("paypal")}
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {t("fast")}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Fermer"
            >
              <AppIcon name="close" className="h-5 w-5" />
            </button>

            <h3 className="text-green-deep font-amiri text-2xl font-bold mb-2 text-center">
              {t("payNow")}
            </h3>
            <p className="text-center text-gold font-lato font-bold text-3xl mb-6">
              {finalAmount}€
            </p>

            <div className="space-y-3">
              {/* Stripe button */}
              <button className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-green-deep py-3 font-bold text-white transition-colors hover:bg-green-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold font-cairo">
                <AppIcon name="card" className="h-5 w-5" />
                {t("cardPayment")} (Stripe)
              </button>

              {/* PayPal button */}
              <button className="min-h-11 w-full rounded-lg bg-[#0070ba] py-3 font-bold text-white transition-colors hover:bg-[#005ea6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold font-cairo">
                PayPal
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 font-cairo text-sm">
                  {t("orBankTransfer")}
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Bank transfer info */}
              <div className="bg-cream border border-gold/30 rounded-xl p-4">
                <p className="mb-2 flex items-center gap-2 text-sm text-gray-600 font-cairo">
                  <AppIcon name="building" className="h-4 w-4" />
                  {t("bankTransfer")}
                </p>
                <p className="font-mono text-sm text-gray-700 bg-white rounded-lg px-3 py-2 break-all">
                  FR76 XXXX XXXX XXXX XXXX XXXX XXX
                </p>
                <p className="text-gray-500 text-xs font-cairo mt-2">
                  Ref: <span className="font-mono font-bold">SUPPORT-SITE</span>
                </p>
              </div>
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400 font-cairo">
              <AppIcon name="lock" className="h-3.5 w-3.5" />
              Paiement sécurisé — SSL 256-bit
            </p>
          </div>
        </div>
      )}
    </>
  );
}
