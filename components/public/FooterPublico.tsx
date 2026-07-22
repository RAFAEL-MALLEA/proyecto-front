"use client";

import { useTranslations } from "next-intl";

export default function FooterPublico() {
  const t = useTranslations("Footer");
  const anioActual = new Date().getFullYear();

  const enlacesNavegacion = [
    {
      nombre: t("inicio"),
      href: "#inicio",
    },
    {
      nombre: t("servicios"),
      href: "#servicios",
    },
    {
      nombre: t("certificaciones"),
      href: "#certificaciones",
    },
    {
      nombre: t("contacto"),
      href: "#contacto",
    },
  ];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:flex-wrap md:justify-between">
          <div className="w-full md:flex-1">
            <a
              href="#inicio"
              className="text-xl font-bold tracking-tight"
            >
              Rafael
              <span className="text-blue-400">Mallea</span>
            </a>

            <p className="mt-4 max-w-sm leading-7 text-slate-400">
              {t("descripcion")}
            </p>
          </div>

          <div className="w-full md:min-w-40 md:flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              {t("navegacion")}
            </h2>

            <nav
              aria-label={t("navegacionFooter")}
              className="mt-5 flex flex-col items-start gap-3"
            >
              {enlacesNavegacion.map((enlace) => (
                <a
                  key={enlace.href}
                  href={enlace.href}
                  className="text-sm text-slate-400 transition hover:text-blue-400"
                >
                  {enlace.nombre}
                </a>
              ))}
            </nav>
          </div>

          <div className="w-full md:flex-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              {t("perfilProfesional")}
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400">
              {t("linkedinDescripcion")}
            </p>

            <a
              href="https://www.linkedin.com/in/rafael-m-6915ab223/"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-600 hover:text-white"
            >
              {t("verLinkedin")}

              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("derechos", { anio: anioActual })}</p>
          <p>{t("desarrollado")}</p>
        </div>
      </div>
    </footer>
  );
}