"use client";

import { useCallback, useEffect, useState } from "react";

import CrearExperienciaForm from "@/components/CrearExperienciaForm";
import EditarExperienciaForm from "@/components/EditarExperienciaForm";
import {
    actualizarExperiencia,
    eliminarExperiencia,
    obtenerTodasLasExperiencias,
} from "@/services/experiencia";
import type {
    Experiencia,
    ExperienciaUpdate,
} from "@/types/Experiencia";


const formateadorFecha = new Intl.DateTimeFormat(
    "es-CL",
    {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }
);


function formatearFecha(
    fecha: string | null
): string {
    if (!fecha) {
        return "Actualidad";
    }

    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaLocal = new Date(anio, mes - 1, dia);

    if (Number.isNaN(fechaLocal.getTime())) {
        return "Fecha no disponible";
    }

    return formateadorFecha.format(fechaLocal);
}


function obtenerMensajeError(
    errorDesconocido: unknown
): string {
    return errorDesconocido instanceof Error
        ? errorDesconocido.message
        : "Ocurrió un error inesperado.";
}


export default function ExperienciaAdminPage() {
    const [experiencias, setExperiencias] = useState<
        Experiencia[]
    >([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState<
        string | null
    >(null);

    const [mensaje, setMensaje] = useState<
        string | null
    >(null);

    const [
        experienciaProcesandoId,
        setExperienciaProcesandoId,
    ] = useState<number | null>(null);

    const [
        experienciaEditando,
        setExperienciaEditando,
    ] = useState<Experiencia | null>(null);


    const cargarExperiencias = useCallback(async () => {
        try {
            setCargando(true);
            setError(null);

            const token = sessionStorage.getItem(
                "access_token"
            );

            if (!token) {
                throw new Error(
                    "No existe una sesión válida. Vuelve a iniciar sesión."
                );
            }

            const experienciasRecibidas =
                await obtenerTodasLasExperiencias(token);

            setExperiencias(experienciasRecibidas);
        } catch (errorDesconocido) {
            setError(
                obtenerMensajeError(errorDesconocido)
            );
        } finally {
            setCargando(false);
        }
    }, []);


    useEffect(() => {
        cargarExperiencias();
    }, [cargarExperiencias]);


    function manejarExperienciaCreada(
        experienciaCreada: Experiencia
    ) {
        setExperiencias((experienciasActuales) => [
            experienciaCreada,
            ...experienciasActuales,
        ]);

        setError(null);
        setMensaje(
            `Experiencia "${experienciaCreada.cargo} — ${experienciaCreada.empresa}" creada correctamente.`
        );
    }


    function iniciarEdicion(
        experiencia: Experiencia
    ) {
        setExperienciaEditando(experiencia);
        setError(null);
        setMensaje(null);

        requestAnimationFrame(() => {
            document
                .getElementById(
                    "formulario-edicion-experiencia"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        });
    }


    function manejarExperienciaActualizada(
        experienciaActualizada: Experiencia
    ) {
        setExperiencias((experienciasActuales) =>
            experienciasActuales.map(
                (experienciaActual) =>
                    experienciaActual.id ===
                        experienciaActualizada.id
                        ? experienciaActualizada
                        : experienciaActual
            )
        );

        setExperienciaEditando(null);
        setError(null);
        setMensaje(
            `Experiencia "${experienciaActualizada.cargo} — ${experienciaActualizada.empresa}" actualizada correctamente.`
        );
    }


    function cancelarEdicion() {
        setExperienciaEditando(null);
        setError(null);
    }


    async function cambiarPublicado(
        experiencia: Experiencia
    ) {
        try {
            setExperienciaProcesandoId(experiencia.id);
            setError(null);
            setMensaje(null);

            const token = sessionStorage.getItem(
                "access_token"
            );

            if (!token) {
                throw new Error(
                    "No existe una sesión válida. Vuelve a iniciar sesión."
                );
            }

            const cambios: ExperienciaUpdate = {
                publicado: !experiencia.publicado,
            };

            const experienciaActualizada =
                await actualizarExperiencia(
                    experiencia.id,
                    cambios,
                    token
                );

            setExperiencias((experienciasActuales) =>
                experienciasActuales.map(
                    (experienciaActual) =>
                        experienciaActual.id ===
                            experienciaActualizada.id
                            ? experienciaActualizada
                            : experienciaActual
                )
            );

            setMensaje("Estado de publicación actualizado.");
        } catch (errorDesconocido) {
            setError(
                obtenerMensajeError(errorDesconocido)
            );
        } finally {
            setExperienciaProcesandoId(null);
        }
    }


    async function manejarEliminacion(
        experiencia: Experiencia
    ) {
        const confirmado = window.confirm(
            `¿Deseas eliminar la experiencia "${experiencia.cargo} — ${experiencia.empresa}"?`
        );

        if (!confirmado) {
            return;
        }

        try {
            setExperienciaProcesandoId(experiencia.id);
            setError(null);
            setMensaje(null);

            const token = sessionStorage.getItem(
                "access_token"
            );

            if (!token) {
                throw new Error(
                    "No existe una sesión válida. Vuelve a iniciar sesión."
                );
            }

            await eliminarExperiencia(
                experiencia.id,
                token
            );

            setExperiencias((experienciasActuales) =>
                experienciasActuales.filter(
                    (experienciaActual) =>
                        experienciaActual.id !== experiencia.id
                )
            );

            if (
                experienciaEditando?.id === experiencia.id
            ) {
                setExperienciaEditando(null);
            }

            setMensaje("Experiencia eliminada correctamente.");
        } catch (errorDesconocido) {
            setError(
                obtenerMensajeError(errorDesconocido)
            );
        } finally {
            setExperienciaProcesandoId(null);
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
                            Experiencia
                        </h1>

                        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                            Revisa tu trayectoria laboral y controla cuáles
                            experiencias estarán publicadas en el portafolio.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={cargarExperiencias}
                        disabled={cargando}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cargando
                            ? "Actualizando..."
                            : "Actualizar listado"}
                    </button>
                </header>


                {experienciaEditando ? (
                    <EditarExperienciaForm
                        key={experienciaEditando.id}
                        experiencia={experienciaEditando}
                        onExperienciaActualizada={
                            manejarExperienciaActualizada
                        }
                        onCancelar={cancelarEdicion}
                    />
                ) : (
                    <CrearExperienciaForm
                        onExperienciaCreada={
                            manejarExperienciaCreada
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
                            Cargando experiencia...
                        </p>
                    </div>
                )}


                {!cargando &&
                    experiencias.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                No existen experiencias registradas
                            </h2>

                            <p className="mt-2 text-slate-600">
                                Utiliza el formulario superior para registrar
                                tu primera experiencia laboral.
                            </p>
                        </div>
                    )}


                {!cargando &&
                    experiencias.length > 0 && (
                        <div className="flex flex-wrap gap-6">
                            {experiencias.map((experiencia) => {
                                const procesando =
                                    experienciaProcesandoId ===
                                    experiencia.id;

                                return (
                                    <article
                                        key={experiencia.id}
                                        className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:w-[calc(50%-0.75rem)]"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                    Experiencia #{experiencia.id}
                                                </p>

                                                <h2 className="mt-2 text-xl font-bold text-slate-900">
                                                    {experiencia.cargo}
                                                </h2>

                                                <p className="mt-1 text-sm font-medium text-blue-600">
                                                    {experiencia.empresa}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <span
                                                    className={
                                                        experiencia.publicado
                                                            ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                                                            : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
                                                    }
                                                >
                                                    {experiencia.publicado
                                                        ? "Publicado"
                                                        : "Borrador"}
                                                </span>

                                                {experiencia.trabajo_actual && (
                                                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                                                        Actual
                                                    </span>
                                                )}
                                            </div>
                                        </div>


                                        <p className="mt-5 line-clamp-4 leading-7 text-slate-600">
                                            {experiencia.descripcion}
                                        </p>


                                        {experiencia.tecnologias && (
                                            <div className="mt-5">
                                                <p className="text-sm font-semibold text-slate-900">
                                                    Tecnologías
                                                </p>

                                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                                    {experiencia.tecnologias}
                                                </p>
                                            </div>
                                        )}


                                        <div className="mt-5 flex flex-col gap-2 text-sm text-slate-500">
                                            <p>
                                                {formatearFecha(
                                                    experiencia.fecha_inicio
                                                )}{" "}
                                                —{" "}
                                                {experiencia.trabajo_actual
                                                    ? "Actualidad"
                                                    : formatearFecha(
                                                        experiencia.fecha_fin
                                                    )}
                                            </p>

                                            {experiencia.ubicacion && (
                                                <p>{experiencia.ubicacion}</p>
                                            )}
                                        </div>


                                        <div className="mt-auto flex flex-wrap gap-3 pt-7">
                                            <button
                                                type="button"
                                                disabled={procesando}
                                                onClick={() =>
                                                    iniciarEdicion(experiencia)
                                                }
                                                className="rounded-lg border border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                disabled={procesando}
                                                onClick={() =>
                                                    cambiarPublicado(experiencia)
                                                }
                                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {experiencia.publicado
                                                    ? "Pasar a borrador"
                                                    : "Publicar"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={procesando}
                                                onClick={() =>
                                                    manejarEliminacion(experiencia)
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