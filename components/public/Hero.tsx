"use client";

import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("Hero");

  const tecnologias = [
    "Next.js",
    "React",
    "TypeScript",
    "Python",
    "FastAPI",
    "MySQL",
    "PostgreSQL",
  ];

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen scroll-mt-20 items-center overflow-hidden bg-slate-950 px-6 py-28 text-white"
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-14 lg:flex-row lg:justify-between">
        <div className="w-full lg:w-[55%]">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            {t("profesion")}
          </p>

          <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t("saludo")}{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Rafael Mallea Ramírez
            </span>
          </h1>

          <h2 className="mt-5 text-xl font-semibold text-slate-200 sm:text-2xl">
            {t("cargo")}
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            {t("descripcion")}
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <a
              href="#servicios"
              className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
            >
              {t("verServicios")}
            </a>

            <a
              href="#certificaciones"
              className="w-full rounded-lg border border-slate-600 px-6 py-3 text-center font-semibold text-slate-200 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-950 sm:w-auto"
            >
              {t("verCertificaciones")}
            </a>

            <a
              href="/documentos/rafael-mallea-cv.pdf"
              download="rafael-mallea-cv.pdf"
              className="w-full rounded-lg border border-slate-600 px-6 py-3 text-center font-semibold text-slate-200 transition hover:border-blue-400 hover:bg-blue-500/10 hover:text-white sm:w-auto"
            >
              {t("descargarCv")}
            </a>
          </div>
        </div>

        <div className="flex w-full justify-center lg:w-[40%] lg:justify-end">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900/80 p-7 shadow-2xl shadow-blue-950/40 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>

            <div className="mt-8">
              <p className="font-mono text-sm text-blue-300">
                {t("perfilCodigo")}
              </p>

              <h3 className="mt-3 text-2xl font-bold text-white">
                {t("tarjetaTitulo")}
              </h3>

              <p className="mt-4 leading-7 text-slate-400">
                {t("tarjetaDescripcion")}
              </p>

              <div className="mt-7">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  {t("tecnologias")}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {tecnologias.map((tecnologia) => (
                    <span
                      key={tecnologia}
                      className="rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300"
                    >
                      {tecnologia}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}