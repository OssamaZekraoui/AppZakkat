import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import NonprofitBanner from "@/components/home/NonprofitBanner";
import HowItWorks from "@/components/home/HowItWorks";
import Categories from "@/components/home/Categories";
import ActiveCauses from "@/components/home/ActiveCauses";
import ZakatTeaser from "@/components/home/ZakatTeaser";
import SiteDonation from "@/components/home/SiteDonation";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/home/Footer";
import { getLocale, languageAlternates, localizedPath, seoCopy, siteUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = getLocale(value);
  const copy = seoCopy[locale];
  const url = localizedPath(locale);
  return { title: copy.homeTitle, description: copy.homeDescription, alternates: { canonical: url, languages: languageAlternates() }, openGraph: { title: copy.homeTitle, description: copy.homeDescription, url, locale, type: "website" }, twitter: { card: "summary_large_image", title: copy.homeTitle, description: copy.homeDescription } };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = getLocale(value);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "Diyae", url: siteUrl, logo: `${siteUrl}/diyae-logo.png`, nonprofitStatus: "NonprofitType" },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, name: "Diyae", url: siteUrl, inLanguage: locale, publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "WebPage", name: seoCopy[locale].homeTitle, description: seoCopy[locale].homeDescription, url: localizedPath(locale), inLanguage: locale, isPartOf: { "@id": `${siteUrl}/#website` } },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      {/* 1. Navigation fixe */}
      <Navbar />
      <main id="main-content" tabIndex={-1}>
      {/* 2. Hero Section */}
      <HeroSection />

      {/* 3. Bannière But Non Lucratif */}
      <NonprofitBanner />

      {/* 4. Comment ça marche */}
      <HowItWorks />

      {/* 5. Catégories */}
      <Categories />

      {/* 6. Causes Actives */}
      <ActiveCauses />

      {/* 7. Calculateur Zakat (teaser) */}
      <ZakatTeaser />

      {/* 8. Section Don Frais Site */}
      <SiteDonation />

      {/* 9. Témoignages */}
      <Testimonials />
      </main>

      {/* 10. Footer */}
      <Footer />
    </>
  );
}
