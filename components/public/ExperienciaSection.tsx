"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerExperiencias } from "@/services/experiencia";
import type { Experiencia } from "@/types/Experiencia";

export default function ExperienciaSection() {
    const locale = useLocale();
    const t = useTranslations("Experiencia");

    const [experiencias, setExperiencias] = useState<
        Experiencia[]
    >([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function formatearFecha(fecha: string) {
        const [anio, mes, dia] = fecha.split("-").map(Number);
        const fechaLocal = new Date(anio, mes - 1, dia);

        return new Intl.DateTimeFormat(
            locale === "en" ? "en-US" : "es-CL",
            {
                month: "long",
                year: "numeric",
            }
        ).format(fechaLocal);
    }

    function formatearRango(experiencia: Experiencia) {
        const inicio = formatearFecha(experiencia.fecha_inicio);

        if (
            experiencia.trabajo_actual ||
            !experiencia.fecha_fin
        ) {
            return `${inicio} — ${t("actualidad")}`;
        }

        return `${inicio} — ${formatearFecha(
            experiencia.fecha_fin
        )}`;
    }

    function dividirTecnologias(
        tecnologias: string | null
    ): string[] {
        if (!tecnologias) {
            return [];
        }

        return tecnologias
            .split(",")
            .map((tecnologia) => tecnologia.trim())
            .filter(Boolean);
    }

    useEffect(() => {
        let componenteActivo = true;

        async function cargarExperiencias() {
            try {
                setCargando(true);
                setError(null);

                const experienciasRecibidas =
                    await obtenerExperiencias();

                if (componenteActivo) {
                    setExperiencias(experienciasRecibidas);
                }
            } catch (errorDesconocido) {
                if (!componenteActivo) {
                    return;
                }

                const mensaje =
                    errorDesconocido instanceof Error
                        ? errorDesconocido.message
                        : t("errorDesconocido");

                setError(mensaje);
            } finally {
                if (componenteActivo) {
                    setCargando(false);
                }
            }
        }

        cargarExperiencias();

        return () => {
            componenteActivo = false;
        };
    }, [t]);

    return (
        <section
            id="experiencia"
            className="scroll-mt-20 bg-slate-50 px-6 py-24"
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
                        experiencias.length === 0 && (
                            <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
                                <p className="text-slate-500">
                                    {t("sinExperiencias")}
                                </p>
                            </div>
                        )}

                    {!cargando &&
                        !error &&
                        experiencias.length > 0 && (
                            <div className="flex flex-col gap-6">
                                {experiencias.map((experiencia) => (
                                    <article
                                        key={experiencia.id}
                                        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl sm:flex-row sm:items-start"
                                    >
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100 text-xl font-bold text-blue-700">
                                            {experiencia.logo ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={experiencia.logo}
                                                    alt={experiencia.empresa}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                experiencia.empresa
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <h3 className="text-xl font-bold text-slate-900">
                                                    {experiencia.cargo}
                                                </h3>

                                                {experiencia.trabajo_actual && (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                                        {t("trabajoActual")}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm font-medium text-blue-600">
                                                {experiencia.url_empresa ? (
                                                    <a
                                                        href={experiencia.url_empresa}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        {experiencia.empresa}
                                                    </a>
                                                ) : (
                                                    experiencia.empresa
                                                )}
                                                {experiencia.ubicacion && (
                                                    <span className="text-slate-500">
                                                        {" "}
                                                        · {experiencia.ubicacion}
                                                    </span>
                                                )}
                                            </p>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {formatearRango(experiencia)}
                                            </p>

                                            <p className="mt-4 leading-7 text-slate-600">
                                                {experiencia.descripcion}
                                            </p>

                                            {dividirTecnologias(
                                                experiencia.tecnologias
                                            ).length > 0 && (
                                                    <div className="mt-4 flex flex-wrap gap-2">
                                                        {dividirTecnologias(
                                                            experiencia.tecnologias
                                                        ).map((tecnologia) => (
                                                            <span
                                                                key={tecnologia}
                                                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                                                            >
                                                                {tecnologia}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                </div>
            </div>
        </section>
    );
}