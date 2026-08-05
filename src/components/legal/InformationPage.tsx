import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { Link } from "@/i18n/navigation";

type Locale = "ar" | "fr" | "en";

type Section = { id?: string; title: string; paragraphs: string[] };

export default function InformationPage({
  locale,
  eyebrow,
  title,
  intro,
  sections,
  updated,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
  updated: string;
}) {
  const back = locale === "ar" ? "العودة إلى الرئيسية" : locale === "en" ? "Back to home" : "Retour à l’accueil";

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="min-h-screen bg-white-off px-4 pb-20 pt-28">
        <article className="mx-auto max-w-4xl">
          <header className="rounded-[2rem] bg-green-deep px-6 py-10 text-white shadow-xl sm:px-10">
            <p className="font-cairo text-sm font-black uppercase tracking-[0.18em] text-gold-light">{eyebrow}</p>
            <h1 className="mt-3 font-amiri text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl font-cairo text-base leading-8 text-white/80">{intro}</p>
            <p className="mt-6 font-cairo text-sm text-white/65">{updated}</p>
          </header>

          <div className="mt-8 space-y-6">
            {sections.map((section) => (
              <section key={section.title} id={section.id} className="scroll-mt-24 rounded-2xl border border-green-deep/10 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="font-amiri text-2xl font-bold text-green-deep">{section.title}</h2>
                <div className="mt-4 space-y-3 font-cairo text-base leading-8 text-green-deep/75">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/" className="inline-flex min-h-12 items-center rounded-full border border-green-deep/15 bg-white px-6 font-cairo font-bold text-green-deep transition-colors hover:border-gold hover:bg-green-pale/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
              {back}
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
