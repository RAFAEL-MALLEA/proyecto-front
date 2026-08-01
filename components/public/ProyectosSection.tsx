"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerProyectosPublicados } from "@/services/proyectos";
import type { Proyecto } from "@/types/Proyecto";

interface ImagenProyectoProps {
  imagen: string | null;
  titulo: string;
  textoAlternativo: string;
  esFondo?: boolean;
}

const duracionTransicion = 680;

function ImagenProyecto({
  imagen,
  titulo,
  textoAlternativo,
  esFondo = false,
}: ImagenProyectoProps) {
  const [imagenConError, setImagenConError] =
    useState(false);

  if (!imagen || imagenConError) {
    return (
      <div className="flex h-full min-h-44 w-full items-center justify-center bg-slate-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 font-mono text-xl font-bold text-blue-300">
          {"</>"}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-44 w-full overflow-hidden bg-slate-900">
      {/* La imagen puede ser una ruta local o una URL administrada desde el panel. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagen}
        alt={esFondo ? "" : textoAlternativo}
        aria-hidden={esFondo || undefined}
        title={titulo}
        onError={() => setImagenConError(true)}
        className={
          esFondo
            ? "h-full w-full object-cover brightness-[0.45] saturate-50"
            : "h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
        }
      />
    </div>
  );
}

function separarTecnologias(
  tecnologias: string
): string[] {
  return tecnologias
    .split(",")
    .map((tecnologia) => tecnologia.trim())
    .filter(Boolean);
}

function obtenerMensajeError(
  errorDesconocido: unknown,
  mensajePredeterminado: string
): string {
  return errorDesconocido instanceof Error
    ? errorDesconocido.message
    : mensajePredeterminado;
}

function obtenerClasePosicion(
  posicion: number,
  animando: boolean
): string {
  if (animando) {
    if (posicion === 0) {
      return "z-40 -translate-x-[115%] -rotate-2 scale-[0.96] opacity-0";
    }

    if (posicion === 1) {
      return "z-30 translate-x-0 scale-100 opacity-100";
    }

    if (posicion === 2) {
      return "z-20 translate-x-[9%] scale-[0.94] opacity-70 sm:translate-x-[12%]";
    }

    if (posicion === 3) {
      return "z-10 translate-x-[17%] scale-[0.88] opacity-35 sm:translate-x-[22%]";
    }

    return "pointer-events-none z-0 translate-x-[24%] scale-[0.82] opacity-0";
  }

  if (posicion === 0) {
    return "z-30 translate-x-0 scale-100 opacity-100";
  }

  if (posicion === 1) {
    return "z-20 translate-x-[9%] scale-[0.94] opacity-70 sm:translate-x-[12%]";
  }

  if (posicion === 2) {
    return "z-10 translate-x-[17%] scale-[0.88] opacity-35 sm:translate-x-[22%]";
  }

  return "pointer-events-none z-0 translate-x-[24%] scale-[0.82] opacity-0";
}

export default function ProyectosSection() {
  const t = useTranslations("Proyectos");

  const [proyectos, setProyectos] = useState<
    Proyecto[]
  >([]);
  const [ordenProyectos, setOrdenProyectos] =
    useState<number[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<
    string | null
  >(null);
  const [animando, setAnimando] =
    useState(false);
  const [reducirMovimiento, setReducirMovimiento] =
    useState(false);

  useEffect(() => {
    let componenteActivo = true;

    async function cargarProyectos() {
      try {
        setCargando(true);
        setError(null);

        const proyectosRecibidos =
          await obtenerProyectosPublicados();

        if (componenteActivo) {
          setProyectos(proyectosRecibidos);
          setOrdenProyectos(
            proyectosRecibidos.map(
              (_, indice) => indice
            )
          );
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

    cargarProyectos();

    return () => {
      componenteActivo = false;
    };
  }, [t]);

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
    if (!animando) {
      return;
    }

    const temporizador = window.setTimeout(() => {
      setOrdenProyectos((ordenActual) => {
        if (ordenActual.length <= 1) {
          return ordenActual;
        }

        return [
          ...ordenActual.slice(1),
          ordenActual[0],
        ];
      });
      setAnimando(false);
    }, duracionTransicion);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [animando]);

  function mostrarSiguienteProyecto() {
    if (
      animando ||
      ordenProyectos.length <= 1
    ) {
      return;
    }

    if (reducirMovimiento) {
      setOrdenProyectos((ordenActual) => [
        ...ordenActual.slice(1),
        ordenActual[0],
      ]);
      return;
    }

    setAnimando(true);
  }

  const indiceActivo = ordenProyectos[0];
  const proyectoActivo =
    indiceActivo === undefined
      ? undefined
      : proyectos[indiceActivo];

  return (
    <section
      id="proyectos"
      aria-busy={animando || cargando}
      className="relative h-full w-full overflow-hidden bg-slate-950 px-4 pb-5 pt-24 text-white sm:px-6 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-4 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center">
        {cargando && (
          <div className="w-full">
            <EstadoCarga mensaje={t("cargando")} />
          </div>
        )}

        {!cargando && error && (
          <div className="w-full">
            <MensajeError
              titulo={t("errorTitulo")}
              mensaje={error}
            />
          </div>
        )}

        {!cargando &&
          !error &&
          proyectos.length === 0 && (
            <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 px-6 py-10 text-center">
              <p className="text-slate-400">
                {t("sinProyectos")}
              </p>
            </div>
          )}

        {!cargando &&
          !error &&
          proyectoActivo && (
            <div className="relative h-[min(620px,calc(100vh-7rem))] w-full">
              {ordenProyectos.map(
                (indiceProyecto, posicion) => {
                  const proyecto =
                    proyectos[indiceProyecto];
                  const esActivo = posicion === 0;
                  const esSiguiente =
                    posicion === 1;
                  const tecnologias =
                    separarTecnologias(
                      proyecto.tecnologias
                    );

                  return (
                    <div
                      key={proyecto.id}
                      className="pointer-events-none absolute inset-0 flex items-center"
                    >
                      <div
                        className={`relative w-[94%] transform-gpu transition-[transform,opacity] duration-[680ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform sm:w-[90%] ${obtenerClasePosicion(posicion, animando)}`}
                      >
                        {esActivo ? (
                          <article
                            aria-live="polite"
                            className="group flex max-h-[min(620px,calc(100vh-7rem))] min-h-[420px] w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur lg:flex-row"
                          >
                            <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-52 lg:h-auto lg:w-[54%]">
                              <ImagenProyecto
                                imagen={proyecto.imagen}
                                titulo={proyecto.titulo}
                                textoAlternativo={t(
                                  "vistaPrevia",
                                  {
                                    titulo:
                                      proyecto.titulo,
                                  }
                                )}
                              />

                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-slate-950/40" />
                            </div>

                            <div className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-7 lg:p-9">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-400">
                                  {proyecto.destacado
                                    ? t("destacado")
                                    : t("etiqueta")}
                                </span>
                                <span className="h-px flex-1 bg-slate-700" />
                              </div>

                              <h2 className="mt-4 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                                {proyecto.titulo}
                              </h2>

                              <p className="mt-4 max-h-24 overflow-hidden text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                                {proyecto.descripcion}
                              </p>

                              {tecnologias.length > 0 && (
                                <div className="mt-5">
                                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    {t("tecnologias")}
                                  </p>

                                  <div className="mt-3 flex max-h-16 flex-wrap gap-2 overflow-hidden">
                                    {tecnologias.map(
                                      (tecnologia) => (
                                        <span
                                          key={tecnologia}
                                          className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-300"
                                        >
                                          {tecnologia}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
                                {(proyecto.url_repositorio ||
                                  proyecto.url_demo) && (
                                  <div className="flex flex-wrap gap-3">
                                    {proyecto.url_demo && (
                                      <a
                                        href={
                                          proyecto.url_demo
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="pointer-events-auto inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                      >
                                        {t(
                                          "demostracion"
                                        )}
                                        <span aria-hidden="true">
                                          ↗
                                        </span>
                                      </a>
                                    )}

                                    {proyecto.url_repositorio && (
                                      <a
                                        href={
                                          proyecto.url_repositorio
                                        }
                                        target="_blank"
                                        rel="noreferrer"
                                        className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                      >
                                        {t("repositorio")}
                                        <span aria-hidden="true">
                                          ↗
                                        </span>
                                      </a>
                                    )}
                                  </div>
                                )}

                                <p className="ml-auto font-mono text-sm text-slate-400">
                                  <span className="text-xl font-bold text-blue-300">
                                    {indiceProyecto + 1}
                                  </span>{" "}
                                  / {proyectos.length}
                                </p>
                              </div>
                            </div>
                          </article>
                        ) : (
                          <button
                            type="button"
                            onClick={
                              esSiguiente
                                ? mostrarSiguienteProyecto
                                : undefined
                            }
                            disabled={
                              !esSiguiente || animando
                            }
                            aria-label={
                              esSiguiente
                                ? `${t("etiqueta")}: ${proyecto.titulo}`
                                : undefined
                            }
                            aria-hidden={
                              esSiguiente
                                ? undefined
                                : true
                            }
                            tabIndex={
                              esSiguiente ? 0 : -1
                            }
                            className={`pointer-events-auto flex min-h-[420px] w-full overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-left shadow-2xl shadow-black/30 transition hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              esSiguiente
                                ? "cursor-pointer"
                                : "cursor-default"
                            }`}
                          >
                            <div className="relative min-h-[420px] w-full overflow-hidden">
                              <ImagenProyecto
                                imagen={proyecto.imagen}
                                titulo={proyecto.titulo}
                                textoAlternativo=""
                                esFondo
                              />

                              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />

                              <div className="absolute inset-y-0 right-0 flex w-[28%] min-w-28 flex-col items-center justify-center px-3 text-center">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300/80">
                                  {proyecto.destacado
                                    ? t("destacado")
                                    : t("etiqueta")}
                                </span>
                                <span className="mt-3 line-clamp-3 text-sm font-bold text-white/90 sm:text-base">
                                  {proyecto.titulo}
                                </span>
                              </div>
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
      </div>
    </section>
  );
}