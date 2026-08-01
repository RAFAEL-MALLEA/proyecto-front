"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";
import { useState } from "react";

import SelectorIdioma from "@/components/public/SelectorIdioma";

export const idsSeccionesPublicas = [
  "inicio",
  "proyectos",
  "experiencia",
  "tecnologias",
  "certificaciones",
  "contacto",
] as const;

export type SeccionPublicaId =
  (typeof idsSeccionesPublicas)[number];

export function esSeccionPublicaId(
  valor: string
): valor is SeccionPublicaId {
  return idsSeccionesPublicas.includes(
    valor as SeccionPublicaId
  );
}

interface HeaderPublicoProps {
  seccionActiva: SeccionPublicaId;
  onNavegar: (seccion: SeccionPublicaId) => void;
}

export default function HeaderPublico({
  seccionActiva,
  onNavegar,
}: HeaderPublicoProps) {
  const [menuAbierto, setMenuAbierto] =
    useState(false);
  const t = useTranslations("Header");

  const enlacesNavegacion = [
    {
      id: "inicio" as const,
      nombre: t("inicio"),
    },
    {
      id: "proyectos" as const,
      nombre: t("proyectos"),
    },
    {
      id: "experiencia" as const,
      nombre: t("experiencia"),
    },
    {
      id: "tecnologias" as const,
      nombre: t("tecnologias"),
    },
    {
      id: "certificaciones" as const,
      nombre: t("certificaciones"),
    },
    {
      id: "contacto" as const,
      nombre: t("contacto"),
    },
  ];

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  function manejarNavegacion(
    event: MouseEvent<HTMLAnchorElement>,
    seccion: SeccionPublicaId
  ) {
    event.preventDefault();
    onNavegar(seccion);
    cerrarMenu();
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-800 bg-slate-950/90 text-white backdrop-blur">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-6">
        <a
          href="#inicio"
          onClick={(event: MouseEvent<HTMLAnchorElement>) =>
            manejarNavegacion(event, "inicio")
          }
          className="text-xl font-bold tracking-tight"
        >
          Rafael
          <span className="text-blue-400">Mallea</span>
        </a>

        <nav
          aria-label={t("navegacionPrincipal")}
          className="hidden items-center gap-6 md:flex"
        >
          {enlacesNavegacion.map((enlace) => {
            const activo =
              seccionActiva === enlace.id;

            return (
              <a
                key={enlace.id}
                href={`#${enlace.id}`}
                onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                  manejarNavegacion(
                    event,
                    enlace.id
                  )
                }
                aria-current={
                  activo ? "location" : undefined
                }
                className={
                  activo
                    ? "relative py-2 text-sm font-semibold text-white after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-blue-400"
                    : "relative py-2 text-sm font-medium text-slate-300 transition hover:text-blue-400"
                }
              >
                {enlace.nombre}
              </a>
            );
          })}

          <SelectorIdioma />

          <Link
            href="/login"
            className="rounded-lg border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-300 transition hover:bg-blue-600 hover:text-white"
          >
            {t("administrar")}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={
            menuAbierto
              ? t("cerrarMenu")
              : t("abrirMenu")
          }
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          onClick={() =>
            setMenuAbierto(
              (estadoActual) => !estadoActual
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-200 transition hover:border-blue-500 hover:text-blue-400 md:hidden"
        >
          {menuAbierto ? (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          )}
        </button>
      </div>

      {menuAbierto && (
        <nav
          id="menu-movil"
          aria-label={t("navegacionMovil")}
          className="border-t border-slate-800 bg-slate-950 px-6 py-5 md:hidden"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
            {enlacesNavegacion.map((enlace) => {
              const activo =
                seccionActiva === enlace.id;

              return (
                <a
                  key={enlace.id}
                  href={`#${enlace.id}`}
                  onClick={(event: MouseEvent<HTMLAnchorElement>) =>
                    manejarNavegacion(
                      event,
                      enlace.id
                    )
                  }
                  aria-current={
                    activo ? "location" : undefined
                  }
                  className={
                    activo
                      ? "rounded-lg bg-blue-500/15 px-4 py-3 text-sm font-semibold text-blue-300 ring-1 ring-inset ring-blue-500/40"
                      : "rounded-lg px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-900 hover:text-blue-400"
                  }
                >
                  {enlace.nombre}
                </a>
              );
            })}

            <div className="px-4 py-2">
              <SelectorIdioma />
            </div>

            <Link
              href="/login"
              onClick={cerrarMenu}
              className="mt-2 rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              {t("administrar")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}