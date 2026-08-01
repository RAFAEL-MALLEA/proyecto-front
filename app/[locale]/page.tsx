import CertificacionesSection from "@/components/public/CertificacionesSection";
import ContactoSection from "@/components/public/ContactoSection";
import ExperienciaTemporalSection from "@/components/public/ExperienciaTemporalSection";
import FooterPublico from "@/components/public/FooterPublico";
import HeaderPublico from "@/components/public/HeaderPublico";
import Hero from "@/components/public/Hero";
import ProyectosSection from "@/components/public/ProyectosSection";
import ReproductorMusica from "@/components/public/ReproductorMusica";
import TecnologiasSection from "@/components/public/TecnologiasSection";

export default function HomePage() {
  return (
    <>
      <HeaderPublico />

      <main className="h-screen snap-y snap-proximity overflow-y-auto overscroll-y-contain scroll-smooth [&>section]:flex [&>section]:min-h-screen [&>section]:snap-start [&>section]:scroll-mt-20 [&>section]:items-center">
        <Hero />
        <ProyectosSection />
        <ExperienciaTemporalSection />
        <TecnologiasSection />
        <CertificacionesSection />
        <ContactoSection />
        <FooterPublico />
      </main>

      <ReproductorMusica />
    </>
  );
}