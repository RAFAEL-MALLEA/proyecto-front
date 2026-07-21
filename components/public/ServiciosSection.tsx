"use client";

import { useEffect, useState } from "react";

import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerServicios } from "@/services/servicios";
import type { Servicio } from "@/types/Servicio";

const formateadorPrecio = new Intl.NumberFormat(
  "es-CL",
  {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }
);

export default function ServiciosSection() {
  const [servicios, setServicios] = useState<
    Servicio[]
  >([]);

  const [cargando, setCargando] = useState(true);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    let componenteActivo = true;

    async function cargarServicios() {
      try {
        setCargando(true);
        setError(null);

        const serviciosRecibidos =
          await obtenerServicios();

        if (componenteActivo) {
          setServicios(serviciosRecibidos);
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

    cargarServicios();

    return () => {
      componenteActivo = false;
    };
  }, []);

  return (
    <section
      id="servicios"
      className="bg-slate-50 px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">
            Servicios
          </p>

          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Soluciones tecnológicas para tus proyectos
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            Servicios enfocados en desarrollo web,
            soporte tecnológico y creación de
            soluciones adaptadas a las necesidades
            de cada proyecto.
          </p>
        </div>

        <div className="mt-14">
          {cargando && (
            <EstadoCarga mensaje="Cargando servicios..." />
          )}

          {!cargando && error && (
            <MensajeError mensaje={error} />
          )}

          {!cargando &&
            !error &&
            servicios.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
                <p className="text-slate-500">
                  Actualmente no existen servicios
                  publicados.
                </p>
              </div>
            )}

          {!cargando &&
            !error &&
            servicios.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {servicios.map((servicio) => (
                  <article
                    key={servicio.id}
                    className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600">
                      {"</>"}
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-slate-900">
                      {servicio.Nombre_servicio}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-600">
                      Servicio personalizado según
                      los requerimientos y objetivos
                      del proyecto.
                    </p>

                    <div className="mt-auto pt-7">
                      <p className="text-sm text-slate-500">
                        Valor referencial
                      </p>

                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        {formateadorPrecio.format(
                          servicio.valor
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