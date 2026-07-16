"use client";

import { useEffect, useState } from "react";

import CrearServicioForm from "@/components/CrearServicioForm";
import EditarServicioForm from "@/components/EditarServicioForm";
import { obtenerServicios } from "@/services/servicios";
import type { Servicio } from "@/types/Servicio";

export default function ServiciosAdminPage() {
  const [servicios, setServicios] = useState<Servicio[]>(
    []
  );

  const [servicioEnEdicion, setServicioEnEdicion] =
    useState<Servicio | null>(null);

  const [error, setError] = useState<string | null>(
    null
  );

  function agregarServicioALista(
    servicioCreado: Servicio
  ) {
    setServicios((serviciosActuales) => [
      ...serviciosActuales,
      servicioCreado,
    ]);
  }

  function reemplazarServicioEnLista(
    servicioActualizado: Servicio
  ) {
    setServicios((serviciosActuales) =>
      serviciosActuales.map((servicio) =>
        servicio.id === servicioActualizado.id
          ? servicioActualizado
          : servicio
      )
    );

    setServicioEnEdicion(null);
  }

  useEffect(() => {
    setError(null);

    obtenerServicios()
      .then((data) => {
        console.log("Servicios recibidos:", data);
        setServicios(data);
      })
      .catch((errorDesconocido) => {
        console.error(
          "Error servicios:",
          errorDesconocido
        );

        const mensaje =
          errorDesconocido instanceof Error
            ? errorDesconocido.message
            : "No fue posible cargar los servicios.";

        setError(mensaje);
      });
  }, []);

  return (
    <div className="space-y-8">
      <CrearServicioForm
        onServicioCreado={agregarServicioALista}
      />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Servicios registrados
        </h1>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {servicios.length === 0 ? (
          <p className="mt-4 text-slate-500">
            No existen servicios registrados.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {servicios.map((servicio) => (
              <article
                key={servicio.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                {servicioEnEdicion?.id ===
                servicio.id ? (
                  <EditarServicioForm
                    key={servicio.id}
                    servicio={servicio}
                    onServicioActualizado={
                      reemplazarServicioEnLista
                    }
                    onCancelar={() =>
                      setServicioEnEdicion(null)
                    }
                  />
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {servicio.Nombre_servicio}
                      </h3>

                      <p className="mt-1 text-slate-600">
                        $
                        {Number(
                          servicio.valor
                        ).toLocaleString("es-CL")}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setServicioEnEdicion(servicio)
                      }
                      className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                      Editar
                    </button>
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