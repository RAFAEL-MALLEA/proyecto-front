"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const enlaces = [
  {
    nombre: "Inicio",
    href: "/admin",
  },
  {
    nombre: "Certificaciones",
    href: "/admin/certificaciones",
  },
  {
    nombre: "Servicios",
    href: "/admin/servicios",
  },
  {
    nombre: "Proyectos",
    href: "/admin/proyectos",
  },
  {
    nombre: "Tecnologías",
    href: "/admin/tecnologias",
  },
];


export default function Sidebar() {
  const pathname = usePathname();

  function enlaceActivo(href: string): boolean {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href ||
      pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="w-full rounded-2xl bg-blue-300 p-5 shadow-sm lg:min-h-[calc(100vh-7rem)] lg:w-72">
      <h2 className="text-xl font-bold text-slate-800">
        Panel de administración
      </h2>

      <nav
        aria-label="Navegación administrativa"
        className="mt-8 flex flex-col gap-2"
      >
        {enlaces.map((enlace) => {
          const activo = enlaceActivo(enlace.href);

          return (
            <Link
              key={enlace.href}
              href={enlace.href}
              aria-current={activo ? "page" : undefined}
              className={
                activo
                  ? "rounded-lg bg-white px-4 py-3 font-semibold text-blue-700 shadow-sm"
                  : "rounded-lg px-4 py-3 font-medium text-slate-800 transition hover:bg-white/60 hover:text-blue-700"
              }
            >
              {enlace.nombre}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}