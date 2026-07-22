"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import EstadoCarga from "@/components/public/EstadoCarga";
import MensajeError from "@/components/public/MensajeError";
import { obtenerServicios } from "@/services/servicios";
import type { Servicio } from "@/types/Servicio";

export default function ServiciosSection() {
  const locale = useLocale();
  const t = useTranslations("Servicios");

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formateadorPrecio = new Intl.NumberFormat(
    locale === "en" ? "en-US" : "es-CL",
    {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }
  );

  useEffect(() => {
    let componenteActivo = true;

    async function cargarServicios() {
      try {
        setCargando(true);
        setError(null);

        const serviciosRecibidos = await obtenerServicios();

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
            : t("errorDesconocido");

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
  }, [t]);

  return (
    <section
      id="servicios"
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

          {!cargando && !error && servicios.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-10 text-center">
              <p className="text-slate-500">
                {t("sinServicios")}
              </p>
            </div>
          )}

          {!cargando && !error && servicios.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {servicios.map((servicio) => (
                <article
                  key={servicio.id}
                  className="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl font-bold text-blue-600">
                    {"</>"}
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {servicio.Nombre_servicio}
                  </h3>

                  <p className="mt-4 leading-7 text-slate-600">
                    {t("descripcionTarjeta")}
                  </p>

                  <div className="mt-auto pt-7">
                    <p className="text-sm text-slate-500">
                      {t("valorReferencial")}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-600">
                      {formateadorPrecio.format(servicio.valor)}
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