"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerCertificaciones } from "@/services/certificaciones";
import type { Certificacion } from "@/types/Certificacion";

export default function CertificacionesSection() {
  const locale = useLocale();
  const t = useTranslations("Certificaciones");

  const [certificaciones, setCertificaciones] = useState<
    Certificacion[]
  >([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function formatearFecha(fecha: string) {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaLocal = new Date(anio, mes - 1, dia);

    return new Intl.DateTimeFormat(
      locale === "en" ? "en-US" : "es-CL",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ).format(fechaLocal);
  }

  useEffect(() => {
    let componenteActivo = true;

    async function cargarCertificaciones() {
      try {
        setCargando(true);
        setError(null);

        const certificacionesRecibidas =
          await obtenerCertificaciones();

        if (componenteActivo) {
          setCertificaciones(certificacionesRecibidas);
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

    cargarCertificaciones();

    return () => {
      componenteActivo = false;
    };
  }, [t]);

  return (
    <section
      id="certificaciones"
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
            certificaciones.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-slate-500">
                  {t("sinCertificaciones")}
                </p>
              </div>
            )}

          {!cargando &&
            !error &&
            certificaciones.length > 0 && (
              <div className="flex flex-wrap gap-6">
                {certificaciones.map((certificacion) => (
                  <article
                    key={certificacion.id}
                    className="flex w-full flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">
                        ✓
                      </div>

                      <span
                        className={
                          certificacion.estado === "Completado"
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                            : "rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                        }
                      >
                        {certificacion.estado === "Completado"
                          ? t("estadoCompletado")
                          : t("estadoTerminado")}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-900">
                      {certificacion.nombre_certificacion}
                    </h3>

                    <p className="mt-3 text-sm font-medium text-blue-600">
                      {certificacion.institucion ??
                        t("institucionNoEspecificada")}
                    </p>

                    <p className="mt-4 flex-grow leading-7 text-slate-600">
                      {certificacion.descripcion ??
                        t("sinDescripcion")}
                    </p>

                    <div className="mt-7 border-t border-slate-200 pt-5">
                      <p className="text-sm text-slate-500">
                        {t("fechaObtencion")}
                      </p>

                      <p className="mt-1 font-semibold text-slate-800">
                        {formatearFecha(
                          certificacion.fecha_obtencion
                        )}
                      </p>
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