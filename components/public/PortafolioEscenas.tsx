"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import CertificacionesSection from "@/components/public/CertificacionesSection";
import ContactoSection from "@/components/public/ContactoSection";
import ExperienciaTemporalSection from "@/components/public/ExperienciaTemporalSection";
import FooterPublico from "@/components/public/FooterPublico";
import HeaderPublico, {
  esSeccionPublicaId,
  idsSeccionesPublicas,
  type SeccionPublicaId,
} from "@/components/public/HeaderPublico";
import Hero from "@/components/public/Hero";
import ProyectosSection from "@/components/public/ProyectosSection";
import ReproductorMusica from "@/components/public/ReproductorMusica";
import TecnologiasSection from "@/components/public/TecnologiasSection";

const seccionInicial: SeccionPublicaId = "inicio";
const duracionSalida = 420;
const duracionEntrada = 620;

type FaseTransicion =
  | "estable"
  | "saliendo"
  | "preparando-entrada"
  | "entrando";

type DireccionTransicion = "adelante" | "atras";

function leerSeccionDesdeUrl(): SeccionPublicaId {
  const hash = window.location.hash.replace("#", "");

  return esSeccionPublicaId(hash)
    ? hash
    : seccionInicial;
}

function obtenerDireccion(
  actual: SeccionPublicaId,
  destino: SeccionPublicaId
): DireccionTransicion {
  const indiceActual =
    idsSeccionesPublicas.indexOf(actual);
  const indiceDestino =
    idsSeccionesPublicas.indexOf(destino);

  return indiceDestino >= indiceActual
    ? "adelante"
    : "atras";
}

interface EscenaProps {
  activa: boolean;
  children: React.ReactNode;
  direccion: DireccionTransicion;
  fase: FaseTransicion;
  nombre: SeccionPublicaId;
  reducirMovimiento: boolean;
}

function Escena({
  activa,
  children,
  direccion,
  fase,
  nombre,
  reducirMovimiento,
}: EscenaProps) {
  if (!activa) {
    return (
      <div
        data-escena={nombre}
        aria-hidden="true"
        className="invisible pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-0"
      >
        {children}
      </div>
    );
  }

  const desplazamientoSalida =
    direccion === "adelante"
      ? "-translate-y-10"
      : "translate-y-10";

  const desplazamientoEntrada =
    direccion === "adelante"
      ? "translate-y-10"
      : "-translate-y-10";

  let estadoVisual =
    "translate-y-0 scale-100 opacity-100 blur-0";

  let duracionVisual = "duration-0";

  if (!reducirMovimiento) {
    if (fase === "saliendo") {
      estadoVisual = `${desplazamientoSalida} scale-[0.985] opacity-0 blur-[2px]`;
      duracionVisual =
        "duration-[420ms] ease-[cubic-bezier(0.55,0,0.1,1)]";
    }

    if (fase === "preparando-entrada") {
      estadoVisual = `${desplazamientoEntrada} scale-[1.015] opacity-0 blur-[2px]`;
      duracionVisual = "duration-0";
    }

    if (fase === "entrando") {
      estadoVisual =
        "translate-y-0 scale-100 opacity-100 blur-0";
      duracionVisual =
        "duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
    }
  }

  return (
    <div
      data-escena={nombre}
      aria-hidden="false"
      className={`visible absolute inset-0 z-10 overflow-y-auto overscroll-y-contain transition-[opacity,transform,filter] will-change-transform [&>section]:flex [&>section]:min-h-full [&>section]:items-center ${estadoVisual} ${duracionVisual}`}
    >
      {children}
    </div>
  );
}

export default function PortafolioEscenas() {
  const [seccionActiva, setSeccionActiva] =
    useState<SeccionPublicaId>(seccionInicial);

  const [seccionDestino, setSeccionDestino] =
    useState<SeccionPublicaId | null>(null);

  const [fase, setFase] =
    useState<FaseTransicion>("estable");

  const [direccion, setDireccion] =
    useState<DireccionTransicion>("adelante");

  const [reducirMovimiento, setReducirMovimiento] =
    useState(false);

  const navegarA = useCallback(
    (seccion: SeccionPublicaId) => {
      if (
        seccion === seccionActiva ||
        fase !== "estable"
      ) {
        return;
      }

      const nuevoHash = `#${seccion}`;

      if (window.location.hash !== nuevoHash) {
        window.history.pushState(
          { seccion },
          "",
          `${window.location.pathname}${window.location.search}${nuevoHash}`
        );
      }

      if (reducirMovimiento) {
        setSeccionActiva(seccion);
        return;
      }

      setDireccion(
        obtenerDireccion(seccionActiva, seccion)
      );
      setSeccionDestino(seccion);
      setFase("saliendo");
    },
    [fase, reducirMovimiento, seccionActiva]
  );

  useEffect(() => {
    const consultaMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    function sincronizarPreferencia() {
      setReducirMovimiento(
        consultaMovimiento.matches
      );
    }

    sincronizarPreferencia();
    consultaMovimiento.addEventListener(
      "change",
      sincronizarPreferencia
    );

    return () => {
      consultaMovimiento.removeEventListener(
        "change",
        sincronizarPreferencia
      );
    };
  }, []);

  useEffect(() => {
    if (
      fase !== "saliendo" ||
      seccionDestino === null
    ) {
      return;
    }

    const temporizador = window.setTimeout(() => {
      setSeccionActiva(seccionDestino);
      setFase("preparando-entrada");
    }, duracionSalida);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [fase, seccionDestino]);

  useEffect(() => {
    if (fase !== "preparando-entrada") {
      return;
    }

    let segundoFrame = 0;

    const primerFrame = window.requestAnimationFrame(
      () => {
        segundoFrame = window.requestAnimationFrame(
          () => {
            setFase("entrando");
          }
        );
      }
    );

    return () => {
      window.cancelAnimationFrame(primerFrame);

      if (segundoFrame !== 0) {
        window.cancelAnimationFrame(segundoFrame);
      }
    };
  }, [fase]);

  useEffect(() => {
    if (fase !== "entrando") {
      return;
    }

    const temporizador = window.setTimeout(() => {
      setFase("estable");
      setSeccionDestino(null);
    }, duracionEntrada);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [fase]);

  useEffect(() => {
    function sincronizarConUrl() {
      const seccionUrl = leerSeccionDesdeUrl();

      setFase("estable");
      setSeccionDestino(null);
      setSeccionActiva(seccionUrl);
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

  const seccionIndicada =
    seccionDestino ?? seccionActiva;

  return (
    <>
      <HeaderPublico
        seccionActiva={seccionIndicada}
        onNavegar={navegarA}
      />

      <main
        aria-busy={fase !== "estable"}
        className="relative h-screen overflow-hidden bg-slate-950"
      >
        <Escena
          activa={seccionActiva === "inicio"}
          direccion={direccion}
          fase={fase}
          nombre="inicio"
          reducirMovimiento={reducirMovimiento}
        >
          <Hero onNavegar={navegarA} />
        </Escena>

        <Escena
          activa={seccionActiva === "proyectos"}
          direccion={direccion}
          fase={fase}
          nombre="proyectos"
          reducirMovimiento={reducirMovimiento}
        >
          <ProyectosSection />
        </Escena>

        <Escena
          activa={seccionActiva === "experiencia"}
          direccion={direccion}
          fase={fase}
          nombre="experiencia"
          reducirMovimiento={reducirMovimiento}
        >
          <ExperienciaTemporalSection />
        </Escena>

        <Escena
          activa={seccionActiva === "tecnologias"}
          direccion={direccion}
          fase={fase}
          nombre="tecnologias"
          reducirMovimiento={reducirMovimiento}
        >
          <TecnologiasSection />
        </Escena>

        <Escena
          activa={
            seccionActiva === "certificaciones"
          }
          direccion={direccion}
          fase={fase}
          nombre="certificaciones"
          reducirMovimiento={reducirMovimiento}
        >
          <CertificacionesSection />
        </Escena>

        <Escena
          activa={seccionActiva === "contacto"}
          direccion={direccion}
          fase={fase}
          nombre="contacto"
          reducirMovimiento={reducirMovimiento}
        >
          <ContactoSection />
          <FooterPublico onNavegar={navegarA} />
        </Escena>
      </main>

      <ReproductorMusica />
    </>
  );
}