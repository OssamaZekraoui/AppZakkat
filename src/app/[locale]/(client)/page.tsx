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

export default function HomePage() {
  return (
    <>
      {/* 1. Navigation fixe */}
      <Navbar />

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

      {/* 10. Footer */}
      <Footer />
    </>
  );
}
