"use client";

import { useTranslations } from "next-intl";

export default function ExperienciaTemporalSection() {
  const t = useTranslations("ExperienciaTemporal");

  return (
    <section
      id="experiencia"
      className="flex min-h-screen scroll-mt-20 items-center bg-slate-900 px-6 py-24 text-white"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
          {t("etiqueta")}
        </p>

        <h2 className="mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">
          {t("titulo")}
        </h2>

        <p className="mt-5 max-w-2xl leading-8 text-slate-400">
          {t("descripcion")}
        </p>
      </div>
    </section>
  );
}