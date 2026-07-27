"use client";

import {
  useEffect,
  useState,
} from "react";
import { useTranslations } from "next-intl";

import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerTecnologiasPublicadas } from "@/services/tecnologias";
import type { Tecnologia } from "@/types/Tecnologia";


interface GrupoTecnologias {
  categoria: string;
  tecnologias: Tecnologia[];
}


interface IconoTecnologiaProps {
  icono: string | null;
  nombre: string;
  color: string | null;
  textoAlternativo: string;
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


function IconoTecnologia({
  icono,
  nombre,
  color,
  textoAlternativo,
}: IconoTecnologiaProps) {
  const [iconoConError, setIconoConError] =
    useState(false);

  const colorSeguro = obtenerColorSeguro(color);

  const estiloContenedor = colorSeguro
    ? {
        borderColor: colorSeguro,
        backgroundColor: `${colorSeguro}14`,
      }
    : undefined;

  if (!icono || iconoConError) {
    return (
      <div
        aria-label={textoAlternativo}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white text-lg font-bold text-slate-700"
        style={estiloContenedor}
      >
        {nombre
          .trim()
          .slice(0, 2)
          .toUpperCase()}
      </div>
    );
  }

  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-300 bg-white p-2.5"
      style={estiloContenedor}
    >
      {/* La ruta puede ser local o una URL administrada desde el panel. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icono}
        alt={textoAlternativo}
        onError={() => setIconoConError(true)}
        className="h-full w-full object-contain"
      />
    </div>
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


  function traducirNivel(nivel: number): string {
    if (nivel === 1) {
      return t("nivelBasico");
    }

    if (nivel === 2) {
      return t("nivelIntermedio");
    }

    if (nivel === 3) {
      return t("nivelAvanzado");
    }

    return t("nivelNoEspecificado");
  }


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

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
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
              <div className="flex flex-col gap-14">
                {gruposTecnologias.map(
                  (grupo, indiceGrupo) => {
                    const categoriaId =
                      `categoria-tecnologias-${indiceGrupo}`;

                    return (
                  <section
                    key={grupo.categoria}
                    aria-labelledby={categoriaId}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        id={categoriaId}
                        className="text-2xl font-bold text-white"
                      >
                        {grupo.categoria}
                      </h3>

                      <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                        {t("cantidad", {
                          cantidad:
                            grupo.tecnologias.length,
                        })}
                      </span>
                    </div>


                    <div className="mt-6 flex flex-wrap gap-6">
                      {grupo.tecnologias.map(
                        (tecnologia) => {
                          const colorSeguro =
                            obtenerColorSeguro(
                              tecnologia.color
                            );

                          return (
                            <article
                              key={tecnologia.id}
                              className="flex w-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-950/30 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                              style={
                                colorSeguro
                                  ? {
                                      borderTopColor:
                                        colorSeguro,
                                      borderTopWidth:
                                        "3px",
                                    }
                                  : undefined
                              }
                            >
                              <div className="flex items-start gap-4">
                                <IconoTecnologia
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

                                <div className="min-w-0 flex-1">
                                  <h4 className="break-words text-xl font-bold text-white">
                                    {tecnologia.nombre}
                                  </h4>

                                  <p className="mt-2 text-sm font-semibold text-blue-300">
                                    {t("nivel", {
                                      nivel:
                                        traducirNivel(
                                          tecnologia.nivel
                                        ),
                                    })}
                                  </p>
                                </div>
                              </div>


                              <p className="mt-5 flex-grow leading-7 text-slate-400">
                                {tecnologia.descripcion ??
                                  t("sinDescripcion")}
                              </p>
                            </article>
                          );
                        }
                      )}
                    </div>
                  </section>
                    );
                  }
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}