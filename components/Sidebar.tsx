"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const enlaces = [
  {
    href: "/admin",
    nombre: "Inicio",
  },
  {
    href: "/admin/certificaciones",
    nombre: "Certificaciones",
  },
  {
    href: "/admin/servicios",
    nombre: "Servicios",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 rounded-xl bg-blue-300 p-5 shadow-sm">
      <h2 className="text-xl font-bold text-slate-700">
        Panel de administración
      </h2>

      <nav className="mt-8 space-y-2">
        {enlaces.map((enlace) => {
          const estaActivo =
            enlace.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(enlace.href);

          return (
            <Link
              key={enlace.href}
              href={enlace.href}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                estaActivo
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-700 hover:bg-blue-200"
              }`}
            >
              {enlace.nombre}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}