"use client";

import { useEffect, useState } from "react";

import CrearCertificacionForm from "@/components/CrearCertificacionForm";
import EditarCertificacionForm from "@/components/EditarCertificacionForm";
import {
  eliminarCertificacion,
  obtenerCertificaciones,
} from "@/services/certificaciones";
import type { Certificacion } from "@/types/Certificacion";

export default function CertificacionesAdminPage() {
  const [certificaciones, setCertificaciones] = useState<
    Certificacion[]
  >([]);

  const [
    certificacionEnEdicion,
    setCertificacionEnEdicion,
  ] = useState<Certificacion | null>(null);

  const [
    certificacionEliminandoId,
    setCertificacionEliminandoId,
  ] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  function agregarCertificacionALista(
    certificacionCreada: Certificacion
  ) {
    setCertificaciones((certificacionesActuales) => [
      ...certificacionesActuales,
      certificacionCreada,
    ]);
  }

  function reemplazarCertificacionEnLista(
    certificacionActualizada: Certificacion
  ) {
    setCertificaciones((certificacionesActuales) =>
      certificacionesActuales.map((certificacion) =>
        certificacion.id === certificacionActualizada.id
          ? certificacionActualizada
          : certificacion
      )
    );

    setCertificacionEnEdicion(null);
  }

  async function manejarEliminarCertificacion(
    certificacion: Certificacion
  ) {
    const confirmacion = window.confirm(
      `¿Seguro que deseas eliminar "${certificacion.nombre_certificacion}"?`
    );

    if (!confirmacion) {
      return;
    }

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setError(
        "No existe una sesión válida. Vuelve a iniciar sesión."
      );
      return;
    }

    try {
      setError(null);
      setCertificacionEliminandoId(certificacion.id);

      const certificacionEliminada =
        await eliminarCertificacion(
          certificacion.id,
          token
        );

      setCertificaciones((certificacionesActuales) =>
        certificacionesActuales.filter(
          (certificacionActual) =>
            certificacionActual.id !==
            certificacionEliminada.id
        )
      );

      if (
        certificacionEnEdicion?.id ===
        certificacionEliminada.id
      ) {
        setCertificacionEnEdicion(null);
      }
    } catch (errorDesconocido) {
      const mensaje =
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error al eliminar la certificación.";

      setError(mensaje);
    } finally {
      setCertificacionEliminandoId(null);
    }
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
                {certificacionEnEdicion?.id ===
                certificacion.id ? (
                  <EditarCertificacionForm
                    certificacion={certificacion}
                    onCertificacionActualizada={
                      reemplazarCertificacionEnLista
                    }
                    onCancelar={() =>
                      setCertificacionEnEdicion(null)
                    }
                  />
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {
                          certificacion.nombre_certificacion
                        }
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
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setCertificacionEnEdicion(
                            certificacion
                          )
                        }
                        disabled={
                          certificacionEliminandoId ===
                          certificacion.id
                        }
                        className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          manejarEliminarCertificacion(
                            certificacion
                          )
                        }
                        disabled={
                          certificacionEliminandoId !== null
                        }
                        className="rounded-lg border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {certificacionEliminandoId ===
                        certificacion.id
                          ? "Eliminando..."
                          : "Eliminar"}
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}