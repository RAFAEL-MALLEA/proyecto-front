import HeaderPublico from "@/components/public/HeaderPublico";
import Hero from "@/components/public/Hero";
import ServiciosSection from "@/components/public/ServiciosSection";
import CertificacionesSection from "@/components/public/CertificacionesSection";

export default function HomePage() {
  return (
    <>
      <HeaderPublico />

      <main>
        <Hero />
        <ServiciosSection />
        <CertificacionesSection />
      </main>
    </>
  );
}