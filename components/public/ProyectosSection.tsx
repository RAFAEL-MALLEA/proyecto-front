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

type PosicionCarrusel =
  | "fuera-izquierda"
  | "izquierda"
  | "centro"
  | "derecha"
  | "fuera-derecha";

type DireccionCarrusel = "anterior" | "siguiente";

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
            ? "h-full w-full object-cover brightness-[0.42] saturate-50"
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

function normalizarIndice(
  indice: number,
  total: number
): number {
  return ((indice % total) + total) % total;
}

function obtenerPosicionProyecto(
  indiceProyecto: number,
  indiceActivo: number,
  indiceDestino: number | null,
  direccion: DireccionCarrusel | null,
  total: number
): PosicionCarrusel {
  if (total <= 1) {
    return "centro";
  }

  if (indiceDestino !== null && direccion) {
    if (indiceProyecto === indiceActivo) {
      return direccion === "siguiente"
        ? "izquierda"
        : "derecha";
    }

    if (indiceProyecto === indiceDestino) {
      return "centro";
    }

    if (direccion === "siguiente") {
      const indiceAnterior = normalizarIndice(
        indiceActivo - 1,
        total
      );
      const nuevoIndiceDerecho = normalizarIndice(
        indiceDestino + 1,
        total
      );

      // Con tres proyectos, ambos índices pertenecen a la misma tarjeta.
      // Se oculta por la izquierda y reaparece después a la derecha.
      if (indiceProyecto === indiceAnterior) {
        return "fuera-izquierda";
      }

      if (indiceProyecto === nuevoIndiceDerecho) {
        return "derecha";
      }
    } else {
      const indiceSiguiente = normalizarIndice(
        indiceActivo + 1,
        total
      );
      const nuevoIndiceIzquierdo = normalizarIndice(
        indiceDestino - 1,
        total
      );

      // Con tres proyectos, ambos índices pertenecen a la misma tarjeta.
      // Se oculta por la derecha y reaparece después a la izquierda.
      if (indiceProyecto === indiceSiguiente) {
        return "fuera-derecha";
      }

      if (indiceProyecto === nuevoIndiceIzquierdo) {
        return "izquierda";
      }
    }

    const distanciaAdelante = normalizarIndice(
      indiceProyecto - indiceDestino,
      total
    );
    const distanciaAtras = normalizarIndice(
      indiceDestino - indiceProyecto,
      total
    );

    return distanciaAtras < distanciaAdelante
      ? "fuera-izquierda"
      : "fuera-derecha";
  }

  if (indiceProyecto === indiceActivo) {
    return "centro";
  }

  if (total === 2) {
    return "derecha";
  }

  const indiceIzquierdo = normalizarIndice(
    indiceActivo - 1,
    total
  );
  const indiceDerecho = normalizarIndice(
    indiceActivo + 1,
    total
  );

  if (indiceProyecto === indiceIzquierdo) {
    return "izquierda";
  }

  if (indiceProyecto === indiceDerecho) {
    return "derecha";
  }

  const distanciaAdelante = normalizarIndice(
    indiceProyecto - indiceActivo,
    total
  );
  const distanciaAtras = normalizarIndice(
    indiceActivo - indiceProyecto,
    total
  );

  return distanciaAtras < distanciaAdelante
    ? "fuera-izquierda"
    : "fuera-derecha";
}

function obtenerClasePosicion(
  posicion: PosicionCarrusel,
  reorganizando: boolean,
  direccion: DireccionCarrusel | null
): string {
  if (posicion === "fuera-izquierda") {
    return "pointer-events-none z-0 -translate-x-[78%] scale-[0.76] opacity-0";
  }

  if (posicion === "izquierda") {
    return reorganizando && direccion === "anterior"
      ? "z-20 -translate-x-[42%] scale-[0.86] opacity-0 sm:-translate-x-[38%]"
      : "z-20 -translate-x-[42%] scale-[0.86] opacity-45 sm:-translate-x-[38%]";
  }

  if (posicion === "centro") {
    return "z-40 translate-x-0 scale-100 opacity-100";
  }

  if (posicion === "derecha") {
    return reorganizando && direccion === "siguiente"
      ? "z-30 translate-x-[42%] scale-[0.88] opacity-0 sm:translate-x-[38%]"
      : "z-30 translate-x-[42%] scale-[0.88] opacity-65 sm:translate-x-[38%]";
  }

  return "pointer-events-none z-0 translate-x-[78%] scale-[0.76] opacity-0";
}

export default function ProyectosSection() {
  const t = useTranslations("Proyectos");

  const [proyectos, setProyectos] = useState<
    Proyecto[]
  >([]);
  const [indiceActivo, setIndiceActivo] =
    useState(0);
  const [indiceDestino, setIndiceDestino] =
    useState<number | null>(null);
  const [direccion, setDireccion] =
    useState<DireccionCarrusel | null>(null);
  const [reorganizando, setReorganizando] =
    useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<
    string | null
  >(null);
  const [reducirMovimiento, setReducirMovimiento] =
    useState(false);

  const animando = indiceDestino !== null;

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
          setIndiceActivo(0);
          setIndiceDestino(null);
          setDireccion(null);
          setReorganizando(false);
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
    if (indiceDestino === null) {
      return;
    }

    const destinoActual = indiceDestino;

    const temporizador = window.setTimeout(() => {
      setIndiceActivo(destinoActual);
      setIndiceDestino(null);
      setReorganizando(true);
    }, duracionTransicion);

    return () => {
      window.clearTimeout(temporizador);
    };
  }, [indiceDestino]);

  useEffect(() => {
    if (!reorganizando) {
      return;
    }

    let segundoFrame = 0;

    const primerFrame = window.requestAnimationFrame(
      () => {
        segundoFrame = window.requestAnimationFrame(
          () => {
            setReorganizando(false);
            setDireccion(null);
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
  }, [reorganizando]);

  function cambiarProyecto(
    nuevaDireccion: DireccionCarrusel
  ) {
    if (
      animando ||
      reorganizando ||
      proyectos.length <= 1
    ) {
      return;
    }

    const desplazamiento =
      nuevaDireccion === "siguiente" ? 1 : -1;
    const nuevoIndice = normalizarIndice(
      indiceActivo + desplazamiento,
      proyectos.length
    );

    setDireccion(nuevaDireccion);

    if (reducirMovimiento) {
      setIndiceActivo(nuevoIndice);
      setReorganizando(true);
      return;
    }

    setIndiceDestino(nuevoIndice);
  }

  function mostrarSiguienteProyecto() {
    cambiarProyecto("siguiente");
  }

  function mostrarProyectoAnterior() {
    cambiarProyecto("anterior");
  }

  const indiceVisual =
    indiceDestino ?? indiceActivo;
  const proyectoActivo = proyectos[indiceVisual];

  return (
    <section
      id="proyectos"
      aria-busy={animando || reorganizando || cargando}
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

      <div className="relative mx-auto flex h-full w-full max-w-7xl items-center justify-center">
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
              {proyectos.map(
                (proyecto, indiceProyecto) => {
                  const posicion =
                    obtenerPosicionProyecto(
                      indiceProyecto,
                      indiceActivo,
                      indiceDestino,
                      direccion,
                      proyectos.length
                    );
                  const esCentro =
                    posicion === "centro";
                  const esDerecha =
                    posicion === "derecha";
                  const esIzquierda =
                    posicion === "izquierda";
                  const tecnologias =
                    separarTecnologias(
                      proyecto.tecnologias
                    );

                  return (
                    <div
                      key={
                        proyecto.id ?? indiceProyecto
                      }
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                      <div
                        className={`relative w-[88%] transform-gpu will-change-transform sm:w-[80%] lg:w-[72%] ${
                          reorganizando
                            ? "transition-none"
                            : "transition-[transform,opacity] duration-[680ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        } ${obtenerClasePosicion(
                          posicion,
                          reorganizando,
                          direccion
                        )}`}
                      >
                        {esCentro ? (
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
                                    {indiceVisual + 1}
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
                              esDerecha
                                ? mostrarSiguienteProyecto
                                : esIzquierda
                                  ? mostrarProyectoAnterior
                                  : undefined
                            }
                            disabled={
                              (!esDerecha && !esIzquierda) ||
                              animando ||
                              reorganizando
                            }
                            aria-label={
                              esDerecha
                                ? `${t("etiqueta")}: ${proyecto.titulo}`
                                : esIzquierda
                                  ? `${t("etiqueta")}: ${proyecto.titulo}`
                                  : undefined
                            }
                            aria-hidden={
                              esDerecha || esIzquierda
                                ? undefined
                                : true
                            }
                            tabIndex={
                              esDerecha || esIzquierda
                                ? 0
                                : -1
                            }
                            className={`pointer-events-auto flex min-h-[420px] w-full overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-left shadow-2xl shadow-black/30 transition focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                              esDerecha || esIzquierda
                                ? "cursor-pointer hover:border-blue-400 hover:brightness-110"
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

                              <div
                                className={`absolute inset-0 ${
                                  esIzquierda
                                    ? "bg-gradient-to-l from-slate-950/90 via-slate-950/60 to-slate-950/20"
                                    : "bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/20"
                                }`}
                              />

                              <div
                                className={`absolute inset-y-0 flex w-[34%] min-w-32 flex-col items-center justify-center px-3 text-center ${
                                  esIzquierda
                                    ? "right-0"
                                    : "left-0"
                                }`}
                              >
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