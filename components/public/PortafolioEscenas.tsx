"use client";

import { useCallback, useEffect, useState } from "react";

import CertificacionesSection from "@/components/public/CertificacionesSection";
import ContactoSection from "@/components/public/ContactoSection";
import ExperienciaTemporalSection from "@/components/public/ExperienciaTemporalSection";
import FooterPublico from "@/components/public/FooterPublico";
import HeaderPublico, {
  esSeccionPublicaId,
  type SeccionPublicaId,
} from "@/components/public/HeaderPublico";
import Hero from "@/components/public/Hero";
import ProyectosSection from "@/components/public/ProyectosSection";
import ReproductorMusica from "@/components/public/ReproductorMusica";
import TecnologiasSection from "@/components/public/TecnologiasSection";

const seccionInicial: SeccionPublicaId = "inicio";

function leerSeccionDesdeUrl(): SeccionPublicaId {
  const hash = window.location.hash.replace("#", "");

  return esSeccionPublicaId(hash)
    ? hash
    : seccionInicial;
}

interface EscenaProps {
  activa: boolean;
  children: React.ReactNode;
  nombre: SeccionPublicaId;
}

function Escena({
  activa,
  children,
  nombre,
}: EscenaProps) {
  return (
    <div
      data-escena={nombre}
      aria-hidden={!activa}
      className={
        activa
          ? "visible absolute inset-0 z-10 overflow-y-auto overscroll-y-contain opacity-100 [&>section]:flex [&>section]:min-h-full [&>section]:items-center"
          : "invisible pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0"
      }
    >
      {children}
    </div>
  );
}

export default function PortafolioEscenas() {
  const [seccionActiva, setSeccionActiva] =
    useState<SeccionPublicaId>(seccionInicial);

  const navegarA = useCallback(
    (seccion: SeccionPublicaId) => {
      setSeccionActiva(seccion);

      const nuevoHash = `#${seccion}`;

      if (window.location.hash !== nuevoHash) {
        window.history.pushState(
          { seccion },
          "",
          `${window.location.pathname}${window.location.search}${nuevoHash}`
        );
      }
    },
    []
  );

  useEffect(() => {
    function sincronizarConUrl() {
      setSeccionActiva(leerSeccionDesdeUrl());
    }

    const seccionUrl = leerSeccionDesdeUrl();
    setSeccionActiva(seccionUrl);

    if (!window.location.hash) {
      window.history.replaceState(
        { seccion: seccionInicial },
        "",
        `${window.location.pathname}${window.location.search}#${seccionInicial}`
      );
    }

    window.addEventListener(
      "popstate",
      sincronizarConUrl
    );
    window.addEventListener(
      "hashchange",
      sincronizarConUrl
    );

    return () => {
      window.removeEventListener(
        "popstate",
        sincronizarConUrl
      );
      window.removeEventListener(
        "hashchange",
        sincronizarConUrl
      );
    };
  }, []);

  return (
    <>
      <HeaderPublico
        seccionActiva={seccionActiva}
        onNavegar={navegarA}
      />

      <main className="relative h-screen overflow-hidden bg-slate-950">
        <Escena
          activa={seccionActiva === "inicio"}
          nombre="inicio"
        >
          <Hero onNavegar={navegarA} />
        </Escena>

        <Escena
          activa={seccionActiva === "proyectos"}
          nombre="proyectos"
        >
          <ProyectosSection />
        </Escena>

        <Escena
          activa={seccionActiva === "experiencia"}
          nombre="experiencia"
        >
          <ExperienciaTemporalSection />
        </Escena>

        <Escena
          activa={seccionActiva === "tecnologias"}
          nombre="tecnologias"
        >
          <TecnologiasSection />
        </Escena>

        <Escena
          activa={
            seccionActiva === "certificaciones"
          }
          nombre="certificaciones"
        >
          <CertificacionesSection />
        </Escena>

        <Escena
          activa={seccionActiva === "contacto"}
          nombre="contacto"
        >
          <ContactoSection />
          <FooterPublico onNavegar={navegarA} />
        </Escena>
      </main>

      <ReproductorMusica />
    </>
  );
}