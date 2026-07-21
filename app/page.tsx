import CertificacionesSection from "@/components/public/CertificacionesSection";
import ContactoSection from "@/components/public/ContactoSection";
import FooterPublico from "@/components/public/FooterPublico";
import HeaderPublico from "@/components/public/HeaderPublico";
import Hero from "@/components/public/Hero";
import ServiciosSection from "@/components/public/ServiciosSection";

export default function HomePage() {
  return (
    <>
      <HeaderPublico />

      <main>
        <Hero />
        <ServiciosSection />
        <CertificacionesSection />
        <ContactoSection />
      </main>

      <FooterPublico />
    </>
  );
}