"use client";

import { startTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

type IdiomaDisponible = "es" | "en";

const idiomas: IdiomaDisponible[] = ["es", "en"];

export default function SelectorIdioma() {
  const locale = useLocale();
  const t = useTranslations("Header");
  const pathname = usePathname();
  const router = useRouter();

  function cambiarIdioma(nuevoIdioma: IdiomaDisponible) {
    if (nuevoIdioma === locale) {
      return;
    }

    const rutaConIdioma = pathname.match(/^\/(es|en)(\/|$)/)
      ? pathname.replace(
          /^\/(es|en)(?=\/|$)/,
          `/${nuevoIdioma}`
        )
      : `/${nuevoIdioma}${pathname}`;

    startTransition(() => {
      router.replace(rutaConIdioma);
    });
  }

  return (
    <div
      className="flex items-center gap-1 rounded-lg border border-slate-700 p-1"
      aria-label={t("selectorIdioma")}
    >
      {idiomas.map((idioma) => {
        const activo = locale === idioma;

        return (
          <button
            key={idioma}
            type="button"
            onClick={() => cambiarIdioma(idioma)}
            aria-pressed={activo}
            aria-label={
              idioma === "es"
                ? t("cambiarEspanol")
                : t("cambiarIngles")
            }
            className={
              activo
                ? "rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
                : "rounded-md px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            }
          >
            {idioma.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}