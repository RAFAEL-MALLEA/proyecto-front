"use client";

import { useTranslations } from "next-intl";

const correoContacto = "rafaelmallea2000@gmail.com";
const numeroWhatsapp = "56968177179";

function IconoContacto({ tipo }: { tipo: string }) {
  if (tipo === "correo") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (tipo === "linkedin") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M6.5 8.5H3.2V19h3.3V8.5ZM4.85 3A1.92 1.92 0 1 0 4.85 6.84 1.92 1.92 0 0 0 4.85 3ZM20.8 13c0-3.17-1.69-4.65-3.95-4.65a3.4 3.4 0 0 0-3.07 1.69V8.5h-3.3V19h3.3v-5.2c0-1.37.26-2.7 1.96-2.7 1.67 0 1.69 1.57 1.69 2.79V19h3.3L20.8 13Z" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.4 9.4 0 0 1-4-.9L3 21l1.9-4.8A8.6 8.6 0 1 1 21 11.5Z" />
      <path d="M8.5 8.5c.5 3 2 4.5 5 5" />
    </svg>
  );
}

export default function ContactoSection() {
  const t = useTranslations("Contacto");

  const mensajeWhatsapp = encodeURIComponent(
    t("mensajeWhatsapp")
  );

  const opcionesContacto = [
    {
      titulo: t("correoTitulo"),
      descripcion: t("correoDescripcion"),
      enlace: `mailto:${correoContacto}`,
      textoEnlace: correoContacto,
      tipo: "correo",
    },
    {
      titulo: t("linkedinTitulo"),
      descripcion: t("linkedinDescripcion"),
      enlace:
        "https://www.linkedin.com/in/rafael-m-6915ab223/",
      textoEnlace: t("linkedinEnlace"),
      tipo: "linkedin",
    },
    {
      titulo: t("whatsappTitulo"),
      descripcion: t("whatsappDescripcion"),
      enlace: `https://wa.me/${numeroWhatsapp}?text=${mensajeWhatsapp}`,
      textoEnlace: t("whatsappEnlace"),
      tipo: "whatsapp",
    },
  ];

  return (
    <section
      id="contacto"
      className="scroll-mt-20 bg-slate-950 px-6 py-24 text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            {t("etiqueta")}
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            {t("titulo")}
          </h2>

          <p className="mt-5 leading-8 text-slate-400">
            {t("descripcion")}
          </p>
        </div>

        <div className="mt-14 flex flex-wrap gap-6">
          {opcionesContacto.map((opcion) => (
            <article
              key={opcion.titulo}
              className="flex w-full min-w-0 flex-col rounded-2xl border border-slate-800 bg-slate-900 p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-950/30 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <IconoContacto tipo={opcion.tipo} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                {opcion.titulo}
              </h3>

              <p className="mt-4 flex-grow leading-7 text-slate-400">
                {opcion.descripcion}
              </p>

              <a
                href={opcion.enlace}
                target={
                  opcion.tipo === "correo"
                    ? undefined
                    : "_blank"
                }
                rel={
                  opcion.tipo === "correo"
                    ? undefined
                    : "noreferrer"
                }
                className="mt-7 inline-flex break-all font-semibold text-blue-400 transition hover:text-blue-300"
              >
                <span className="flex items-center gap-2">
                  {opcion.textoEnlace}
                  <span aria-hidden="true">→</span>
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}