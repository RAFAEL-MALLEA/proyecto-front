import Hero from "@/components/public/Hero";
import ServiciosSection from "@/components/public/ServiciosSection";
import CertificacionesSection from "@/components/public/CertificacionesSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ServiciosSection />
      <CertificacionesSection />
    </main>
  );
}