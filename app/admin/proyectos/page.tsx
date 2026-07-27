"use client";

import { useCallback, useEffect, useState } from "react";

import CrearProyectoForm from "@/components/CrearProyectoForm";
import {
  actualizarProyecto,
  eliminarProyecto,
  obtenerTodosLosProyectos,
} from "@/services/proyectos";
import type {
  Proyecto,
  ProyectoUpdate,
} from "@/types/Proyecto";


const formateadorFecha = new Intl.DateTimeFormat(
  "es-CL",
  {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }
);


function formatearFecha(fecha: string): string {
  const fechaProyecto = new Date(fecha);

  if (Number.isNaN(fechaProyecto.getTime())) {
    return "Fecha no disponible";
  }

  return formateadorFecha.format(fechaProyecto);
}


function obtenerMensajeError(
  errorDesconocido: unknown
): string {
  return errorDesconocido instanceof Error
    ? errorDesconocido.message
    : "Ocurrió un error inesperado.";
}


export default function ProyectosAdminPage() {
  const [proyectos, setProyectos] = useState<
    Proyecto[]
  >([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [mensaje, setMensaje] = useState<
    string | null
  >(null);

  const [
    proyectoProcesandoId,
    setProyectoProcesandoId,
  ] = useState<number | null>(null);


  const cargarProyectos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const proyectosRecibidos =
        await obtenerTodosLosProyectos();

      setProyectos(proyectosRecibidos);
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setCargando(false);
    }
  }, []);


  useEffect(() => {
    cargarProyectos();
  }, [cargarProyectos]);


  function manejarProyectoCreado(
    proyectoCreado: Proyecto
  ) {
    setProyectos((proyectosActuales) => [
      proyectoCreado,
      ...proyectosActuales,
    ]);

    setError(null);
    setMensaje(
      `Proyecto "${proyectoCreado.titulo}" creado correctamente.`
    );
  }


  async function cambiarEstadoProyecto(
    proyecto: Proyecto,
    campo: "publicado" | "destacado"
  ) {
    try {
      setProyectoProcesandoId(proyecto.id);
      setError(null);
      setMensaje(null);

      const cambios: ProyectoUpdate =
        campo === "publicado"
          ? {
              publicado: !proyecto.publicado,
            }
          : {
              destacado: !proyecto.destacado,
            };

      const proyectoActualizado =
        await actualizarProyecto(
          proyecto.id,
          cambios
        );

      setProyectos((proyectosActuales) =>
        proyectosActuales.map((proyectoActual) =>
          proyectoActual.id ===
          proyectoActualizado.id
            ? proyectoActualizado
            : proyectoActual
        )
      );

      setMensaje(
        campo === "publicado"
          ? "Estado de publicación actualizado."
          : "Estado destacado actualizado."
      );
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setProyectoProcesandoId(null);
    }
  }


  async function manejarEliminacion(
    proyecto: Proyecto
  ) {
    const confirmado = window.confirm(
      `¿Deseas eliminar el proyecto "${proyecto.titulo}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setProyectoProcesandoId(proyecto.id);
      setError(null);
      setMensaje(null);

      await eliminarProyecto(proyecto.id);

      setProyectos((proyectosActuales) =>
        proyectosActuales.filter(
          (proyectoActual) =>
            proyectoActual.id !== proyecto.id
        )
      );

      setMensaje("Proyecto eliminado correctamente.");
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setProyectoProcesandoId(null);
    }
  }


  return (
    <section className="w-full px-4 py-8 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
              Administración
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Proyectos
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Revisa los proyectos registrados y controla
              cuáles estarán publicados o destacados en el
              portafolio.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarProyectos}
            disabled={cargando}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando
              ? "Actualizando..."
              : "Actualizar listado"}
          </button>
        </header>


        <CrearProyectoForm
          onProyectoCreado={manejarProyectoCreado}
        />


        {mensaje && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800"
          >
            {mensaje}
          </div>
        )}


        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-5 py-4"
          >
            <p className="font-semibold text-red-800">
              No fue posible completar la operación
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        )}


        {cargando && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
            <p className="text-slate-600">
              Cargando proyectos...
            </p>
          </div>
        )}


        {!cargando &&
          proyectos.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                No existen proyectos registrados
              </h2>

              <p className="mt-2 text-slate-600">
                Utiliza el formulario superior para registrar
                el primer proyecto.
              </p>
            </div>
          )}


        {!cargando &&
          proyectos.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {proyectos.map((proyecto) => {
                const procesando =
                  proyectoProcesandoId === proyecto.id;

                return (
                  <article
                    key={proyecto.id}
                    className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:w-[calc(50%-0.75rem)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Proyecto #{proyecto.id}
                        </p>

                        <h2 className="mt-2 text-xl font-bold text-slate-900">
                          {proyecto.titulo}
                        </h2>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={
                            proyecto.publicado
                              ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                              : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
                          }
                        >
                          {proyecto.publicado
                            ? "Publicado"
                            : "Borrador"}
                        </span>

                        {proyecto.destacado && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                            Destacado
                          </span>
                        )}
                      </div>
                    </div>


                    <p className="mt-5 line-clamp-4 leading-7 text-slate-600">
                      {proyecto.descripcion}
                    </p>


                    <div className="mt-5">
                      <p className="text-sm font-semibold text-slate-900">
                        Tecnologías
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {proyecto.tecnologias}
                      </p>
                    </div>


                    <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500">
                      <p>
                        Creado:{" "}
                        {formatearFecha(
                          proyecto.fecha_creacion
                        )}
                      </p>

                      <p>
                        Actualizado:{" "}
                        {formatearFecha(
                          proyecto.fecha_actualizacion
                        )}
                      </p>
                    </div>


                    <div className="mt-auto flex flex-wrap gap-3 pt-7">
                      <button
                        type="button"
                        disabled={procesando}
                        onClick={() =>
                          cambiarEstadoProyecto(
                            proyecto,
                            "publicado"
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {proyecto.publicado
                          ? "Pasar a borrador"
                          : "Publicar"}
                      </button>

                      <button
                        type="button"
                        disabled={procesando}
                        onClick={() =>
                          cambiarEstadoProyecto(
                            proyecto,
                            "destacado"
                          )
                        }
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {proyecto.destacado
                          ? "Quitar destacado"
                          : "Destacar"}
                      </button>

                      <button
                        type="button"
                        disabled={procesando}
                        onClick={() =>
                          manejarEliminacion(proyecto)
                        }
                        className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </div>
    </section>
  );
}