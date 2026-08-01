import CertificacionesSection from "@/components/public/CertificacionesSection";
import ContactoSection from "@/components/public/ContactoSection";
import ExperienciaTemporalSection from "@/components/public/ExperienciaTemporalSection";
import FooterPublico from "@/components/public/FooterPublico";
import HeaderPublico from "@/components/public/HeaderPublico";
import Hero from "@/components/public/Hero";
import ProyectosSection from "@/components/public/ProyectosSection";
import ReproductorMusica from "@/components/public/ReproductorMusica";
import ServiciosSection from "@/components/public/ServiciosSection";
import TecnologiasSection from "@/components/public/TecnologiasSection";

export default function HomePage() {
  return (
    <>
      <HeaderPublico />

      <main>
        <Hero />
        <ServiciosSection />
        <ProyectosSection />
        <ExperienciaTemporalSection />
        <TecnologiasSection />
        <CertificacionesSection />
        <ContactoSection />
      </main>

      <FooterPublico />
      <ReproductorMusica />
    </>
  );
}