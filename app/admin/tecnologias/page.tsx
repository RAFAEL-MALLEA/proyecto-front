"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import CrearTecnologiaForm from "@/components/CrearTecnologiaForm";
import EditarTecnologiaForm from "@/components/EditarTecnologiaForm";
import {
  actualizarTecnologia,
  eliminarTecnologia,
  obtenerTodasLasTecnologias,
} from "@/services/tecnologias";
import type {
  Tecnologia,
  TecnologiaUpdate,
} from "@/types/Tecnologia";


const formateadorFecha = new Intl.DateTimeFormat(
  "es-CL",
  {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }
);


const etiquetasNivel: Record<number, string> = {
  1: "Básico",
  2: "Intermedio",
  3: "Avanzado",
};


function formatearFecha(fecha: string): string {
  const fechaTecnologia = new Date(fecha);

  if (Number.isNaN(fechaTecnologia.getTime())) {
    return "Fecha no disponible";
  }

  return formateadorFecha.format(fechaTecnologia);
}


function obtenerEtiquetaNivel(nivel: number): string {
  return etiquetasNivel[nivel] ?? `Nivel ${nivel}`;
}


function obtenerMensajeError(
  errorDesconocido: unknown
): string {
  return errorDesconocido instanceof Error
    ? errorDesconocido.message
    : "Ocurrió un error inesperado.";
}


function ordenarTecnologias(
  tecnologias: Tecnologia[]
): Tecnologia[] {
  return [...tecnologias].sort(
    (tecnologiaA, tecnologiaB) => {
      const diferenciaOrden =
        tecnologiaA.orden - tecnologiaB.orden;

      if (diferenciaOrden !== 0) {
        return diferenciaOrden;
      }

      return tecnologiaA.nombre.localeCompare(
        tecnologiaB.nombre,
        "es",
        { sensitivity: "base" }
      );
    }
  );
}


export default function TecnologiasAdminPage() {
  const [tecnologias, setTecnologias] = useState<
    Tecnologia[]
  >([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  const [mensaje, setMensaje] = useState<
    string | null
  >(null);

  const [tecnologiaProcesandoId, setTecnologiaProcesandoId] =
    useState<number | null>(null);

  const [tecnologiaEditando, setTecnologiaEditando] =
    useState<Tecnologia | null>(null);


  const cargarTecnologias = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      const tecnologiasRecibidas =
        await obtenerTodasLasTecnologias();

      const tecnologiasOrdenadas =
        ordenarTecnologias(tecnologiasRecibidas);

      setTecnologias(tecnologiasOrdenadas);

      setTecnologiaEditando((tecnologiaActual) => {
        if (!tecnologiaActual) {
          return null;
        }

        return (
          tecnologiasOrdenadas.find(
            (tecnologia) =>
              tecnologia.id === tecnologiaActual.id
          ) ?? null
        );
      });
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setCargando(false);
    }
  }, []);


  useEffect(() => {
    cargarTecnologias();
  }, [cargarTecnologias]);


  function manejarTecnologiaCreada(
    tecnologiaCreada: Tecnologia
  ) {
    setTecnologias((tecnologiasActuales) =>
      ordenarTecnologias([
        ...tecnologiasActuales,
        tecnologiaCreada,
      ])
    );

    setError(null);
    setMensaje(
      `Tecnología "${tecnologiaCreada.nombre}" creada correctamente.`
    );
  }


  function iniciarEdicion(
    tecnologia: Tecnologia
  ) {
    setTecnologiaEditando(tecnologia);
    setError(null);
    setMensaje(null);

    requestAnimationFrame(() => {
      document
        .getElementById(
          "formulario-edicion-tecnologia"
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  }


  function manejarTecnologiaActualizada(
    tecnologiaActualizada: Tecnologia
  ) {
    setTecnologias((tecnologiasActuales) =>
      ordenarTecnologias(
        tecnologiasActuales.map(
          (tecnologiaActual) =>
            tecnologiaActual.id ===
            tecnologiaActualizada.id
              ? tecnologiaActualizada
              : tecnologiaActual
        )
      )
    );

    setTecnologiaEditando(null);
    setError(null);
    setMensaje(
      `Tecnología "${tecnologiaActualizada.nombre}" actualizada correctamente.`
    );
  }


  function cancelarEdicion() {
    setTecnologiaEditando(null);
    setError(null);
  }


  async function cambiarEstadoPublicacion(
    tecnologia: Tecnologia
  ) {
    try {
      setTecnologiaProcesandoId(tecnologia.id);
      setError(null);
      setMensaje(null);

      const cambios: TecnologiaUpdate = {
        publicado: !tecnologia.publicado,
      };

      const tecnologiaActualizada =
        await actualizarTecnologia(
          tecnologia.id,
          cambios
        );

      setTecnologias((tecnologiasActuales) =>
        ordenarTecnologias(
          tecnologiasActuales.map(
            (tecnologiaActual) =>
              tecnologiaActual.id ===
              tecnologiaActualizada.id
                ? tecnologiaActualizada
                : tecnologiaActual
          )
        )
      );

      setTecnologiaEditando((tecnologiaActual) =>
        tecnologiaActual?.id ===
        tecnologiaActualizada.id
          ? tecnologiaActualizada
          : tecnologiaActual
      );

      setMensaje(
        tecnologiaActualizada.publicado
          ? `Tecnología "${tecnologiaActualizada.nombre}" publicada correctamente.`
          : `Tecnología "${tecnologiaActualizada.nombre}" guardada como borrador.`
      );
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setTecnologiaProcesandoId(null);
    }
  }


  async function manejarEliminacion(
    tecnologia: Tecnologia
  ) {
    const confirmado = window.confirm(
      `¿Deseas eliminar la tecnología "${tecnologia.nombre}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setTecnologiaProcesandoId(tecnologia.id);
      setError(null);
      setMensaje(null);

      await eliminarTecnologia(tecnologia.id);

      setTecnologias((tecnologiasActuales) =>
        tecnologiasActuales.filter(
          (tecnologiaActual) =>
            tecnologiaActual.id !== tecnologia.id
        )
      );

      if (
        tecnologiaEditando?.id === tecnologia.id
      ) {
        setTecnologiaEditando(null);
      }

      setMensaje(
        `Tecnología "${tecnologia.nombre}" eliminada correctamente.`
      );
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setTecnologiaProcesandoId(null);
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
              Tecnologías
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-slate-600">
              Crea, edita y administra las tecnologías
              que se mostrarán en tu portafolio.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <span className="rounded-lg bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700">
              Total: {tecnologias.length}
            </span>

            <button
              type="button"
              onClick={cargarTecnologias}
              disabled={cargando}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando
                ? "Actualizando..."
                : "Actualizar listado"}
            </button>
          </div>
        </header>


        {tecnologiaEditando ? (
          <EditarTecnologiaForm
            key={tecnologiaEditando.id}
            tecnologia={tecnologiaEditando}
            onTecnologiaActualizada={
              manejarTecnologiaActualizada
            }
            onCancelar={cancelarEdicion}
          />
        ) : (
          <CrearTecnologiaForm
            onTecnologiaCreada={
              manejarTecnologiaCreada
            }
          />
        )}


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
              Cargando tecnologías...
            </p>
          </div>
        )}


        {!cargando &&
          tecnologias.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
              <h2 className="text-xl font-bold text-slate-900">
                No existen tecnologías registradas
              </h2>

              <p className="mt-2 text-slate-600">
                Utiliza el formulario superior para
                registrar la primera tecnología.
              </p>
            </div>
          )}


        {!cargando &&
          tecnologias.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {tecnologias.map((tecnologia) => {
                const procesando =
                  tecnologiaProcesandoId ===
                  tecnologia.id;

                const editando =
                  tecnologiaEditando?.id ===
                  tecnologia.id;

                return (
                  <article
                    key={tecnologia.id}
                    className={
                      editando
                        ? "flex w-full flex-col rounded-2xl border border-blue-400 bg-blue-50/40 p-6 shadow-sm md:w-[calc(50%-0.75rem)]"
                        : "flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:w-[calc(50%-0.75rem)]"
                    }
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-lg font-bold text-slate-700"
                          style={
                            tecnologia.color
                              ? {
                                  borderColor:
                                    tecnologia.color,
                                }
                              : undefined
                          }
                        >
                          {tecnologia.nombre
                            .trim()
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Tecnología #{tecnologia.id}
                          </p>

                          <h2 className="mt-2 break-words text-xl font-bold text-slate-900">
                            {tecnologia.nombre}
                          </h2>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={
                            tecnologia.publicado
                              ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                              : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
                          }
                        >
                          {tecnologia.publicado
                            ? "Publicada"
                            : "Borrador"}
                        </span>

                        {editando && (
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                            En edición
                          </span>
                        )}
                      </div>
                    </div>


                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                        {tecnologia.categoria}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {obtenerEtiquetaNivel(
                          tecnologia.nivel
                        )}
                      </span>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        Orden: {tecnologia.orden}
                      </span>
                    </div>


                    <p className="mt-5 flex-grow leading-7 text-slate-600">
                      {tecnologia.descripcion ??
                        "Sin descripción registrada."}
                    </p>


                    <div className="mt-5 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          Color:
                        </span>

                        {tecnologia.color ? (
                          <>
                            <span
                              aria-hidden="true"
                              className="h-5 w-5 rounded-full border border-slate-300"
                              style={{
                                backgroundColor:
                                  tecnologia.color,
                              }}
                            />

                            <code className="break-all">
                              {tecnologia.color}
                            </code>
                          </>
                        ) : (
                          <span>No especificado</span>
                        )}
                      </div>

                      <p className="break-all">
                        <span className="font-semibold text-slate-900">
                          Icono: {" "}
                        </span>

                        {tecnologia.icono ??
                          "No especificado"}
                      </p>
                    </div>


                    <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500">
                      <p>
                        Creada: {" "}
                        {formatearFecha(
                          tecnologia.fecha_creacion
                        )}
                      </p>

                      <p>
                        Actualizada: {" "}
                        {formatearFecha(
                          tecnologia.fecha_actualizacion
                        )}
                      </p>
                    </div>


                    <div className="mt-auto flex flex-wrap gap-3 pt-7">
                      <button
                        type="button"
                        disabled={procesando}
                        onClick={() =>
                          iniciarEdicion(tecnologia)
                        }
                        className="rounded-lg border border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {editando ? "Editando" : "Editar"}
                      </button>

                      <button
                        type="button"
                        disabled={procesando}
                        onClick={() =>
                          cambiarEstadoPublicacion(
                            tecnologia
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {procesando
                          ? "Procesando..."
                          : tecnologia.publicado
                            ? "Pasar a borrador"
                            : "Publicar"}
                      </button>

                      <button
                        type="button"
                        disabled={procesando}
                        onClick={() =>
                          manejarEliminacion(tecnologia)
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