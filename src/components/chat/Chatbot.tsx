"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import AppIcon from "@/components/ui/AppIcon";

type Message = { role: "user" | "assistant"; content: string };
const TEXT = {
  ar: { title: "مساعد ضياء", open: "فتح المساعد", close: "إغلاق", welcome: "مرحباً! كيف يمكنني مساعدتك في استعمال منصة ضياء؟", placeholder: "اكتب سؤالك...", send: "إرسال", loading: "جارٍ التفكير...", error: "الخدمة غير متاحة حالياً. يرجى التواصل مع الدعم التقني." },
  fr: { title: "Assistant Diyae", open: "Ouvrir l’assistant", close: "Fermer", welcome: "Bonjour ! Comment puis-je vous aider à utiliser Diyae ?", placeholder: "Écrivez votre question…", send: "Envoyer", loading: "Réflexion en cours…", error: "Le service est temporairement indisponible. Contactez le support technique." },
  en: { title: "Diyae Assistant", open: "Open assistant", close: "Close", welcome: "Hello! How can I help you use Diyae?", placeholder: "Write your question…", send: "Send", loading: "Thinking…", error: "The service is temporarily unavailable. Please contact technical support." },
} as const;

export default function Chatbot() {
  const localeValue = useLocale();
  const locale = localeValue === "ar" || localeValue === "en" ? localeValue : "fr";
  const t = TEXT[locale];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: t.welcome }]);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next); setInput(""); setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale, messages: next }) });
      const data = await response.json();
      if (!response.ok) throw new Error();
      setMessages((current) => [...current, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: t.error }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="fixed bottom-4 end-4 z-[70] font-cairo sm:bottom-6 sm:end-6">
      {open && <section role="dialog" aria-label={t.title} className="mb-3 flex h-[min(70vh,520px)] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-green-deep/10 bg-white shadow-2xl">
        <header className="flex items-center justify-between bg-green-deep px-4 py-3 text-white"><h2 className="font-bold">{t.title}</h2><button type="button" onClick={() => setOpen(false)} aria-label={t.close} className="cursor-pointer rounded-lg p-2 hover:bg-white/10"><AppIcon name="close" className="h-5 w-5" /></button></header>
        <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-white-off p-4">{messages.map((message, index) => <div key={index} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-6 ${message.role === "user" ? "ms-auto bg-green-deep text-white" : "me-auto border border-green-deep/10 bg-white text-green-deep"}`}>{message.content}</div>)}{loading && <p className="text-sm text-green-deep/60">{t.loading}</p>}<div ref={endRef} /></div>
        <form onSubmit={submit} className="flex gap-2 border-t border-green-deep/10 bg-white p-3"><label htmlFor="chat-input" className="sr-only">{t.placeholder}</label><input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} maxLength={1000} placeholder={t.placeholder} className="min-w-0 flex-1 rounded-xl border border-green-deep/20 px-3 py-2 text-sm text-green-deep outline-none focus:border-gold" /><button type="submit" disabled={!input.trim() || loading} aria-label={t.send} className="cursor-pointer rounded-xl bg-gold p-3 text-green-deep disabled:cursor-not-allowed disabled:opacity-50"><AppIcon name="send" className="h-5 w-5" /></button></form>
      </section>}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? t.close : t.open} className="ms-auto flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gold text-green-deep shadow-xl transition-colors hover:bg-gold-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-deep"><AppIcon name={open ? "close" : "sparkles"} className="h-6 w-6" /></button>
    </div>
  );
}
