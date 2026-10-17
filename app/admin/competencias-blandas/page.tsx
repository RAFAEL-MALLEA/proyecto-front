"use client";

import { useCallback, useEffect, useState } from "react";

import CrearCompetenciaBlandaForm from "@/components/CrearCompetenciaBlandaForm";
import EditarCompetenciaBlandaForm from "@/components/EditarCompetenciaBlandaForm";
import {
    actualizarCompetenciaBlanda,
    eliminarCompetenciaBlanda,
    obtenerTodasLasCompetenciasBlandas,
} from "@/services/competenciasBlandas";
import type {
    CompetenciaBlanda,
    CompetenciaBlandaUpdate,
} from "@/types/CompetenciaBlanda";


function obtenerMensajeError(
    errorDesconocido: unknown
): string {
    return errorDesconocido instanceof Error
        ? errorDesconocido.message
        : "Ocurrió un error inesperado.";
}


export default function CompetenciasBlandasAdminPage() {
    const [competencias, setCompetencias] = useState<
        CompetenciaBlanda[]
    >([]);

    const [cargando, setCargando] = useState(true);

    const [error, setError] = useState<
        string | null
    >(null);

    const [mensaje, setMensaje] = useState<
        string | null
    >(null);

    const [
        competenciaProcesandoId,
        setCompetenciaProcesandoId,
    ] = useState<number | null>(null);

    const [
        competenciaEditando,
        setCompetenciaEditando,
    ] = useState<CompetenciaBlanda | null>(null);


    const cargarCompetencias = useCallback(async () => {
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

            const competenciasRecibidas =
                await obtenerTodasLasCompetenciasBlandas(
                    token
                );

            setCompetencias(competenciasRecibidas);
        } catch (errorDesconocido) {
            setError(
                obtenerMensajeError(errorDesconocido)
            );
        } finally {
            setCargando(false);
        }
    }, []);


    useEffect(() => {
        cargarCompetencias();
    }, [cargarCompetencias]);


    function manejarCompetenciaCreada(
        competenciaCreada: CompetenciaBlanda
    ) {
        setCompetencias((competenciasActuales) => [
            competenciaCreada,
            ...competenciasActuales,
        ]);

        setError(null);
        setMensaje(
            `Competencia "${competenciaCreada.nombre}" creada correctamente.`
        );
    }


    function iniciarEdicion(
        competencia: CompetenciaBlanda
    ) {
        setCompetenciaEditando(competencia);
        setError(null);
        setMensaje(null);

        requestAnimationFrame(() => {
            document
                .getElementById(
                    "formulario-edicion-competencia-blanda"
                )
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
        });
    }


    function manejarCompetenciaActualizada(
        competenciaActualizada: CompetenciaBlanda
    ) {
        setCompetencias((competenciasActuales) =>
            competenciasActuales.map(
                (competenciaActual) =>
                    competenciaActual.id ===
                        competenciaActualizada.id
                        ? competenciaActualizada
                        : competenciaActual
            )
        );

        setCompetenciaEditando(null);
        setError(null);
        setMensaje(
            `Competencia "${competenciaActualizada.nombre}" actualizada correctamente.`
        );
    }


    function cancelarEdicion() {
        setCompetenciaEditando(null);
        setError(null);
    }


    async function cambiarPublicado(
        competencia: CompetenciaBlanda
    ) {
        try {
            setCompetenciaProcesandoId(competencia.id);
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

            const cambios: CompetenciaBlandaUpdate = {
                publicado: !competencia.publicado,
            };

            const competenciaActualizada =
                await actualizarCompetenciaBlanda(
                    competencia.id,
                    cambios,
                    token
                );

            setCompetencias((competenciasActuales) =>
                competenciasActuales.map(
                    (competenciaActual) =>
                        competenciaActual.id ===
                            competenciaActualizada.id
                            ? competenciaActualizada
                            : competenciaActual
                )
            );

            setMensaje("Estado de publicación actualizado.");
        } catch (errorDesconocido) {
            setError(
                obtenerMensajeError(errorDesconocido)
            );
        } finally {
            setCompetenciaProcesandoId(null);
        }
    }


    async function manejarEliminacion(
        competencia: CompetenciaBlanda
    ) {
        const confirmado = window.confirm(
            `¿Deseas eliminar la competencia "${competencia.nombre}"?`
        );

        if (!confirmado) {
            return;
        }

        try {
            setCompetenciaProcesandoId(competencia.id);
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

            await eliminarCompetenciaBlanda(
                competencia.id,
                token
            );

            setCompetencias((competenciasActuales) =>
                competenciasActuales.filter(
                    (competenciaActual) =>
                        competenciaActual.id !== competencia.id
                )
            );

            if (
                competenciaEditando?.id === competencia.id
            ) {
                setCompetenciaEditando(null);
            }

            setMensaje("Competencia eliminada correctamente.");
        } catch (errorDesconocido) {
            setError(
                obtenerMensajeError(errorDesconocido)
            );
        } finally {
            setCompetenciaProcesandoId(null);
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
                            Competencias Blandas
                        </h1>

                        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                            Gestiona las habilidades blandas que se mostrarán
                            debajo de tus tecnologías técnicas.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={cargarCompetencias}
                        disabled={cargando}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {cargando
                            ? "Actualizando..."
                            : "Actualizar listado"}
                    </button>
                </header>


                {competenciaEditando ? (
                    <EditarCompetenciaBlandaForm
                        key={competenciaEditando.id}
                        competencia={competenciaEditando}
                        onCompetenciaActualizada={
                            manejarCompetenciaActualizada
                        }
                        onCancelar={cancelarEdicion}
                    />
                ) : (
                    <CrearCompetenciaBlandaForm
                        onCompetenciaCreada={
                            manejarCompetenciaCreada
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
                            Cargando competencias...
                        </p>
                    </div>
                )}


                {!cargando &&
                    competencias.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <h2 className="text-xl font-bold text-slate-900">
                                No existen competencias registradas
                            </h2>

                            <p className="mt-2 text-slate-600">
                                Utiliza el formulario superior para registrar
                                la primera.
                            </p>
                        </div>
                    )}


                {!cargando &&
                    competencias.length > 0 && (
                        <div className="flex flex-wrap gap-6">
                            {competencias.map((competencia) => {
                                const procesando =
                                    competenciaProcesandoId ===
                                    competencia.id;

                                return (
                                    <article
                                        key={competencia.id}
                                        className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-2xl">
                                                    {competencia.icono}
                                                </span>

                                                <h2 className="text-lg font-bold text-slate-900">
                                                    {competencia.nombre}
                                                </h2>
                                            </div>

                                            <span
                                                className={
                                                    competencia.publicado
                                                        ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                                                        : "rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800"
                                                }
                                            >
                                                {competencia.publicado
                                                    ? "Publicado"
                                                    : "Borrador"}
                                            </span>
                                        </div>


                                        <p className="mt-4 flex-grow leading-6 text-slate-600">
                                            {competencia.descripcion}
                                        </p>


                                        <div className="mt-auto flex flex-wrap gap-3 pt-6">
                                            <button
                                                type="button"
                                                disabled={procesando}
                                                onClick={() =>
                                                    iniciarEdicion(competencia)
                                                }
                                                className="rounded-lg border border-blue-300 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                disabled={procesando}
                                                onClick={() =>
                                                    cambiarPublicado(competencia)
                                                }
                                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {competencia.publicado
                                                    ? "Pasar a borrador"
                                                    : "Publicar"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={procesando}
                                                onClick={() =>
                                                    manejarEliminacion(competencia)
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