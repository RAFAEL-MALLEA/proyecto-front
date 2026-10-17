"use client";

import {
  useEffect,
  useState,
} from "react";
import { useTranslations } from "next-intl";

import CompetenciasBlandasSection from "@/components/public/CompetenciasBlandasSection";
import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerTecnologiasPublicadas } from "@/services/tecnologias";
import type { Tecnologia } from "@/types/Tecnologia";


interface GrupoTecnologias {
  categoria: string;
  tecnologias: Tecnologia[];
}


function obtenerColorSeguro(
  color: string | null
): string | undefined {
  if (
    color &&
    /^#[0-9A-Fa-f]{6}$/.test(color)
  ) {
    return color;
  }

  return undefined;
}


function IniciacionIconoPildora({
  icono,
  nombre,
  color,
  textoAlternativo,
}: {
  icono: string | null;
  nombre: string;
  color: string | null;
  textoAlternativo: string;
}) {
  const [iconoConError, setIconoConError] =
    useState(false);

  const colorSeguro = obtenerColorSeguro(color);

  if (!icono || iconoConError) {
    return (
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-slate-900"
        style={{
          backgroundColor: colorSeguro ?? "#e2e8f0",
        }}
      >
        {nombre.trim().slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white p-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icono}
        alt={textoAlternativo}
        onError={() => setIconoConError(true)}
        className="h-full w-full object-contain"
      />
    </span>
  );
}


function agruparTecnologias(
  tecnologias: Tecnologia[],
  categoriaPredeterminada: string
): GrupoTecnologias[] {
  const grupos = new Map<string, Tecnologia[]>();

  tecnologias.forEach((tecnologia) => {
    const categoria =
      tecnologia.categoria.trim() ||
      categoriaPredeterminada;

    const tecnologiasCategoria =
      grupos.get(categoria) ?? [];

    tecnologiasCategoria.push(tecnologia);
    grupos.set(categoria, tecnologiasCategoria);
  });

  return Array.from(grupos.entries()).map(
    ([categoria, tecnologiasCategoria]) => ({
      categoria,
      tecnologias: tecnologiasCategoria,
    })
  );
}


function obtenerMensajeError(
  errorDesconocido: unknown,
  mensajePredeterminado: string
): string {
  return errorDesconocido instanceof Error
    ? errorDesconocido.message
    : mensajePredeterminado;
}


export default function TecnologiasSection() {
  const t = useTranslations("Tecnologias");

  const [tecnologias, setTecnologias] = useState<
    Tecnologia[]
  >([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);


  useEffect(() => {
    let componenteActivo = true;

    async function cargarTecnologias() {
      try {
        setCargando(true);
        setError(null);

        const tecnologiasRecibidas =
          await obtenerTecnologiasPublicadas();

        if (componenteActivo) {
          setTecnologias(tecnologiasRecibidas);
        }
      } catch (errorDesconocido) {
        if (!componenteActivo) {
          return;
        }

        setError(
          obtenerMensajeError(
            errorDesconocido,
            t("errorDesconocido")
          )
        );
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    }

    cargarTecnologias();

    return () => {
      componenteActivo = false;
    };
  }, [t]);


  const gruposTecnologias = agruparTecnologias(
    tecnologias,
    t("sinCategoria")
  );


  return (
    <section
      id="tecnologias"
      className="scroll-mt-20 bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            {t("etiqueta")}
          </p>

          <h2 className="mt-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
            {t("titulo")}
          </h2>

          <p className="mt-5 leading-8 text-slate-400">
            {t("descripcion")}
          </p>
        </div>


        <div className="mt-14">
          {cargando && (
            <EstadoCarga mensaje={t("cargando")} />
          )}


          {!cargando && error && (
            <MensajeError
              titulo={t("errorTitulo")}
              mensaje={error}
            />
          )}


          {!cargando &&
            !error &&
            tecnologias.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-10 text-center">
                <p className="text-slate-400">
                  {t("sinTecnologias")}
                </p>
              </div>
            )}


          {!cargando &&
            !error &&
            gruposTecnologias.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {gruposTecnologias.map((grupo) => (
                  <div
                    key={grupo.categoria}
                    className="flex w-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    <h3 className="text-lg font-bold text-white">
                      {grupo.categoria}
                    </h3>

                    <div className="mt-5 flex flex-wrap gap-3">
                      {grupo.tecnologias.map(
                        (tecnologia) => (
                          <span
                            key={tecnologia.id}
                            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200"
                          >
                            <IniciacionIconoPildora
                              icono={tecnologia.icono}
                              nombre={tecnologia.nombre}
                              color={tecnologia.color}
                              textoAlternativo={t(
                                "iconoAlternativo",
                                {
                                  nombre:
                                    tecnologia.nombre,
                                }
                              )}
                            />

                            {tecnologia.nombre}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          <CompetenciasBlandasSection />
        </div>
      </div>
    </section>
  );
}