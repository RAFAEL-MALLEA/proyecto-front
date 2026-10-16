"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { obtenerServicios } from "@/services/servicios";
import type { Servicio } from "@/types/Servicio";

export default function ServiciosSection() {
  const locale = useLocale();
  const t = useTranslations("Servicios");

  const [servicios, setServicios] = useState<Servicio[]>(
    []
  );
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function formatearValor(valor: number) {
    return new Intl.NumberFormat(
      locale === "en" ? "en-US" : "es-CL",
      {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }
    ).format(valor);
  }

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
    <div className="mx-auto max-w-6xl">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
          {t("etiqueta")}
        </p>

        <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          {t("titulo")}
        </h2>

        <p className="mt-5 leading-8 text-slate-400">
          {t("descripcion")}
        </p>
      </div>

      <div className="mt-14">
        {cargando && (
          <p className="text-center text-slate-400">
            {t("cargando")}
          </p>
        )}

        {!cargando && error && (
          <div className="rounded-xl border border-red-900 bg-red-950/40 px-6 py-5 text-center">
            <p className="font-semibold text-red-400">
              {t("errorTitulo")}
            </p>

            <p className="mt-1 text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {!cargando &&
          !error &&
          servicios.length === 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-10 text-center">
              <p className="text-slate-400">
                {t("sinServicios")}
              </p>
            </div>
          )}

        {!cargando &&
          !error &&
          servicios.length > 0 && (
            <div className="flex flex-wrap gap-6">
              {servicios.map((servicio) => (
                <article
                  key={servicio.id}
                  className="flex w-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-950/30 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl font-bold text-blue-400">
                    ⚙
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-white">
                    {servicio.Nombre_servicio}
                  </h3>

                  <p className="mt-4 flex-grow leading-7 text-slate-400">
                    {t("descripcionTarjeta")}
                  </p>

                  <div className="mt-7 border-t border-slate-800 pt-5">
                    <p className="text-sm text-slate-500">
                      {t("valorReferencial")}
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-400">
                      {formatearValor(
                        Number(servicio.valor)
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}