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
}


function ImagenProyecto({
  imagen,
  titulo,
  textoAlternativo,
}: ImagenProyectoProps) {
  const [imagenConError, setImagenConError] =
    useState(false);

  if (!imagen || imagenConError) {
    return (
      <div className="flex aspect-video w-full items-center justify-center bg-slate-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl font-bold text-blue-400">
          {"</>"}
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden bg-slate-900">
      {/* Se usa img porque la ruta puede ser local o una URL administrada desde el panel. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imagen}
        alt={textoAlternativo}
        title={titulo}
        onError={() => setImagenConError(true)}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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


export default function ProyectosSection() {
  const t = useTranslations("Proyectos");

  const [proyectos, setProyectos] = useState<
    Proyecto[]
  >([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);


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


  return (
    <section
      id="proyectos"
      className="scroll-mt-20 bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            {t("etiqueta")}
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("titulo")}
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
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
            proyectos.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-slate-500">
                  {t("sinProyectos")}
                </p>
              </div>
            )}


          {!cargando &&
            !error &&
            proyectos.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {proyectos.map((proyecto) => {
                  const tecnologias =
                    separarTecnologias(
                      proyecto.tecnologias
                    );

                  return (
                    <article
                      key={proyecto.id}
                      className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl md:w-[calc(50%-0.75rem)]"
                    >
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


                      <div className="flex flex-1 flex-col p-7">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <h3 className="text-xl font-bold text-slate-900">
                            {proyecto.titulo}
                          </h3>

                          {proyecto.destacado && (
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                              {t("destacado")}
                            </span>
                          )}
                        </div>


                        <p className="mt-4 flex-grow leading-7 text-slate-600">
                          {proyecto.descripcion}
                        </p>


                        {tecnologias.length > 0 && (
                          <div className="mt-6">
                            <p className="text-sm font-semibold text-slate-900">
                              {t("tecnologias")}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {tecnologias.map(
                                (tecnologia) => (
                                  <span
                                    key={tecnologia}
                                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                                  >
                                    {tecnologia}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}


                        {(proyecto.url_repositorio ||
                          proyecto.url_demo) && (
                          <div className="mt-7 flex flex-wrap gap-3">
                            {proyecto.url_demo && (
                              <a
                                href={
                                  proyecto.url_demo
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                              >
                                {t("demostracion")}

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
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700"
                              >
                                {t("repositorio")}

                                <span aria-hidden="true">
                                  ↗
                                </span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}