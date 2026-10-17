"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { obtenerCompetenciasBlandas } from "@/services/competenciasBlandas";
import type { CompetenciaBlanda } from "@/types/CompetenciaBlanda";

function obtenerMensajeError(
    errorDesconocido: unknown,
    mensajePredeterminado: string
): string {
    return errorDesconocido instanceof Error
        ? errorDesconocido.message
        : mensajePredeterminado;
}

export default function CompetenciasBlandasSection() {
    const t = useTranslations("CompetenciasBlandas");

    const [competencias, setCompetencias] = useState<
        CompetenciaBlanda[]
    >([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let componenteActivo = true;

        async function cargarCompetencias() {
            try {
                setCargando(true);
                setError(null);

                const competenciasRecibidas =
                    await obtenerCompetenciasBlandas();

                if (componenteActivo) {
                    setCompetencias(competenciasRecibidas);
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

        cargarCompetencias();

        return () => {
            componenteActivo = false;
        };
    }, [t]);

    if (cargando || error || competencias.length === 0) {
        return null;
    }

    return (
        <div className="mt-20 rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
            <h3 className="text-2xl font-bold text-white">
                {t("titulo")}
            </h3>

            <p className="mt-2 text-slate-400">
                {t("descripcion")}
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
                {competencias.map((competencia) => (
                    <article
                        key={competencia.id}
                        className="flex w-full min-w-0 flex-col items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-2xl">
                            {competencia.icono}
                        </div>

                        <h4 className="text-lg font-bold text-white">
                            {competencia.nombre}
                        </h4>

                        <p className="text-sm leading-6 text-slate-400">
                            {competencia.descripcion}
                        </p>
                    </article>
                ))}
            </div>
        </div>
    );
}