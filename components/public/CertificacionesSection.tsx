"use client";

import { useEffect, useState } from "react";

import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerCertificaciones } from "@/services/certificaciones";
import type { Certificacion } from "@/types/Certificacion";

const formateadorFecha = new Intl.DateTimeFormat(
  "es-CL",
  {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }
);

function formatearFecha(fecha: string) {
  const [anio, mes, dia] = fecha
    .split("-")
    .map(Number);

  const fechaLocal = new Date(
    anio,
    mes - 1,
    dia
  );

  return formateadorFecha.format(fechaLocal);
}

export default function CertificacionesSection() {
  const [
    certificaciones,
    setCertificaciones,
  ] = useState<Certificacion[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let componenteActivo = true;

    async function cargarCertificaciones() {
      try {
        setCargando(true);
        setError(null);

        const certificacionesRecibidas =
          await obtenerCertificaciones();

        if (componenteActivo) {
          setCertificaciones(
            certificacionesRecibidas
          );
        }
      } catch (errorDesconocido) {
        if (!componenteActivo) {
          return;
        }

        const mensaje =
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : "Ocurrió un error inesperado.";

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
  }, []);

  return (
    <section
      id="certificaciones"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Certificaciones
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Formación y aprendizaje continuo
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Certificaciones y cursos que respaldan
            mis conocimientos en desarrollo de
            software, programación y tecnologías
            de la información.
          </p>
        </div>

        <div className="mt-14">
          {cargando && (
            <EstadoCarga mensaje="Cargando certificaciones..." />
          )}

          {!cargando && error && (
            <MensajeError mensaje={error} />
          )}

          {!cargando &&
            !error &&
            certificaciones.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-slate-500">
                  Actualmente no existen
                  certificaciones publicadas.
                </p>
              </div>
            )}

          {!cargando &&
            !error &&
            certificaciones.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certificaciones.map(
                  (certificacion) => (
                    <article
                      key={certificacion.id}
                      className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white hover:shadow-xl"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">
                          ✓
                        </div>

                        <span
                          className={
                            certificacion.estado ===
                            "Completado"
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                              : "rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
                          }
                        >
                          {certificacion.estado}
                        </span>
                      </div>

                      <h3 className="mt-6 text-xl font-bold text-slate-900">
                        {
                          certificacion.nombre_certificacion
                        }
                      </h3>

                      <p className="mt-3 text-sm font-medium text-blue-600">
                        {certificacion.institucion ??
                          "Institución no especificada"}
                      </p>

                      <p className="mt-4 flex-grow leading-7 text-slate-600">
                        {certificacion.descripcion ??
                          "Sin descripción disponible."}
                      </p>

                      <div className="mt-7 border-t border-slate-200 pt-5">
                        <p className="text-sm text-slate-500">
                          Fecha de obtención
                        </p>

                        <p className="mt-1 font-semibold text-slate-800">
                          {formatearFecha(
                            certificacion.fecha_obtencion
                          )}
                        </p>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}