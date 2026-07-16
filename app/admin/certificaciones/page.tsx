"use client";

import { useEffect, useState } from "react";

import CrearCertificacionForm from "@/components/CrearCertificacionForm";
import { obtenerCertificaciones } from "@/services/certificaciones";
import type { Certificacion } from "@/types/Certificacion";

export default function CertificacionesAdminPage() {
  const [certificaciones, setCertificaciones] = useState<
    Certificacion[]
  >([]);

  const [error, setError] = useState<string | null>(null);

  function agregarCertificacionALista(
    certificacionCreada: Certificacion
  ) {
    setCertificaciones((certificacionesActuales) => [
      ...certificacionesActuales,
      certificacionCreada,
    ]);
  }

  useEffect(() => {
    setError(null);

    obtenerCertificaciones()
      .then((data) => {
        console.log(
          "Certificaciones recibidas:",
          data
        );

        setCertificaciones(data);
      })
      .catch((errorDesconocido) => {
        console.error(
          "Error certificaciones:",
          errorDesconocido
        );

        const mensaje =
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : "No fue posible cargar las certificaciones.";

        setError(mensaje);
      });
  }, []);

  return (
    <div className="space-y-8">
      <CrearCertificacionForm
        onCertificacionCreada={
          agregarCertificacionALista
        }
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Certificaciones registradas
        </h1>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {certificaciones.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No existen certificaciones registradas.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {certificaciones.map((certificacion) => (
              <article
                key={certificacion.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {certificacion.nombre_certificacion}
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-700">
                      Institución:
                    </span>{" "}
                    {certificacion.institucion ??
                      "No especificada"}
                  </p>

                  <p>
                    <span className="font-medium text-slate-700">
                      Descripción:
                    </span>{" "}
                    {certificacion.descripcion ??
                      "Sin descripción"}
                  </p>

                  <p>
                    <span className="font-medium text-slate-700">
                      Fecha:
                    </span>{" "}
                    {certificacion.fecha_obtencion}
                  </p>

                  <p>
                    <span className="font-medium text-slate-700">
                      Estado:
                    </span>{" "}
                    {certificacion.estado}
                  </p>

                  {certificacion.imagen && (
                    <p>
                      <span className="font-medium text-slate-700">
                        Imagen:
                      </span>{" "}
                      {certificacion.imagen}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}