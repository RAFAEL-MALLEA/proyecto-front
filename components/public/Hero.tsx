"use client";

import { useTranslations } from "next-intl";
import type { MouseEvent } from "react";

import type { SeccionPublicaId } from "@/components/public/HeaderPublico";

interface HeroProps {
  onNavegar: (seccion: SeccionPublicaId) => void;
}

interface DatoHudProps {
  etiqueta: string;
  valor: string;
}

function DatoHud({ etiqueta, valor }: DatoHudProps) {
  return (
    <div className="min-w-0 flex-1 border-l border-blue-400/30 pl-3 sm:pl-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
        {etiqueta}
      </p>
      <p className="mt-1 truncate text-xs font-semibold text-slate-200 sm:text-sm">
        {valor}
      </p>
    </div>
  );
}

export default function Hero({ onNavegar }: HeroProps) {
  const t = useTranslations("Hero");

  function manejarNavegacion(
    event: MouseEvent<HTMLAnchorElement>,
    seccion: SeccionPublicaId
  ) {
    event.preventDefault();
    onNavegar(seccion);
  }

  return (
    <section
      id="inicio"
      className="relative flex h-full min-h-full w-full items-center overflow-hidden bg-slate-950 px-4 pb-8 pt-24 text-white sm:px-6 sm:pb-10 sm:pt-28 lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_24%_30%,rgba(37,99,235,0.18),transparent_40%),radial-gradient(circle_at_78%_68%,rgba(6,182,212,0.12),transparent_38%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:52px_52px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-4 top-28 w-px bg-gradient-to-b from-blue-400/50 via-blue-400/10 to-transparent sm:left-6 lg:left-10"
      />

      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-12">
        <div className="flex w-full min-w-0 flex-col lg:w-[56%]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/25 bg-emerald-400/5 px-4 py-2 backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                {t("disponibilidad")}
              </span>
            </div>

            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-blue-300/70 sm:text-xs">
              {t("interfaz")}
            </span>
          </div>

          <p className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-blue-400 sm:text-sm">
            {t("profesion")}
          </p>

          <h1 className="mt-4 max-w-4xl text-[clamp(3.2rem,9vw,7.2rem)] font-black uppercase leading-[0.82] tracking-[-0.065em] text-white">
            <span className="block">Rafael</span>
            <span className="block bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-500 bg-clip-text text-transparent">
              Mallea
            </span>
          </h1>

          <div className="mt-6 flex items-center gap-4">
            <span className="h-px w-12 bg-blue-400 sm:w-20" />
            <h2 className="text-base font-semibold uppercase tracking-[0.22em] text-slate-200 sm:text-xl">
              {t("cargo")}
            </h2>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">
            {t("descripcion")}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="#proyectos"
              onClick={(event) =>
                manejarNavegacion(event, "proyectos")
              }
              className="group inline-flex w-full items-center justify-center gap-3 rounded-sm border border-blue-400 bg-blue-500/15 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-blue-100 transition hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-auto"
            >
              {t("verProyectos")}
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </a>

            <a
              href="/documentos/rafael-mallea-cv.pdf"
              download="rafael-mallea-cv.pdf"
              className="inline-flex w-full items-center justify-center gap-3 rounded-sm border border-slate-600 bg-slate-950/40 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-200 transition hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300 sm:w-auto"
            >
              {t("descargarCv")}
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="mt-8 flex w-full max-w-3xl gap-4 overflow-hidden rounded-sm border-y border-slate-800/90 bg-slate-950/45 py-4 pr-2 backdrop-blur sm:gap-6">
            <DatoHud
              etiqueta={t("estado")}
              valor={t("estadoValor")}
            />
            <DatoHud
              etiqueta={t("ubicacion")}
              valor={t("ubicacionValor")}
            />
            <DatoHud
              etiqueta={t("enfoque")}
              valor={t("enfoqueValor")}
            />
          </div>
        </div>

        <div className="hidden w-[40%] items-center justify-center lg:flex">
          <div className="relative flex aspect-square w-full max-w-[440px] items-center justify-center">
            <div
              aria-hidden="true"
              className="absolute inset-[4%] rounded-full border border-blue-400/15"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[12%] animate-spin rounded-full border border-dashed border-cyan-300/30 [animation-duration:22s]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-[21%] rounded-full border border-blue-300/30 shadow-[0_0_70px_rgba(37,99,235,0.16)]"
            />

            <span
              aria-hidden="true"
              className="absolute left-[10%] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-300 shadow-[0_0_16px_rgba(147,197,253,0.9)]"
            />
            <span
              aria-hidden="true"
              className="absolute right-[18%] top-[19%] h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[13%] right-[30%] h-1.5 w-1.5 rounded-full bg-blue-400"
            />

            <div className="relative flex aspect-square w-[56%] flex-col items-center justify-center rounded-full border border-blue-300/40 bg-slate-950/75 shadow-[inset_0_0_55px_rgba(37,99,235,0.14),0_0_55px_rgba(2,132,199,0.12)] backdrop-blur">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-blue-300/70">
                {t("identidad")}
              </span>
              <span className="mt-3 text-6xl font-black tracking-[-0.08em] text-white xl:text-7xl">
                RM
              </span>
              <span className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                {t("sistemaValor")}
              </span>
            </div>

            <div className="absolute left-0 top-[12%] border-l border-blue-400/30 pl-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {t("sistema")}
              </p>
              <p className="mt-1 text-xs font-semibold text-blue-200">
                {t("sistemaValor")}
              </p>
            </div>

            <div className="absolute bottom-[10%] right-0 border-r border-cyan-300/30 pr-4 text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                {t("senal")}
              </p>
              <p className="mt-1 text-xs font-semibold text-cyan-200">
                {t("senalValor")}
              </p>
            </div>

            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[2%] h-8 w-px -translate-x-1/2 bg-gradient-to-b from-blue-300 to-transparent"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[2%] left-1/2 h-8 w-px -translate-x-1/2 bg-gradient-to-t from-cyan-300 to-transparent"
            />
          </div>
        </div>
      </div>

      <a
        href="#proyectos"
        onClick={(event) =>
          manejarNavegacion(event, "proyectos")
        }
        className="group absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500 transition hover:text-blue-300 focus:outline-none focus:text-blue-300 sm:flex"
      >
        <span>{t("explorar")}</span>
        <span
          aria-hidden="true"
          className="h-7 w-px origin-top animate-pulse bg-gradient-to-b from-blue-300 to-transparent"
        />
      </a>
    </section>
  );
}