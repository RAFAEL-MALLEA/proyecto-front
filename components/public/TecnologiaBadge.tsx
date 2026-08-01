interface TecnologiaBadgeProps {
  nombre: string;
  compacta?: boolean;
}

interface AparienciaTecnologia {
  icono: string;
  clases: string;
}

function normalizarNombre(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#]/g, "");
}

function obtenerIniciales(nombre: string): string {
  const partes = nombre
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean);

  if (partes.length > 1) {
    return partes
      .slice(0, 2)
      .map((parte) => parte[0]?.toUpperCase() ?? "")
      .join("");
  }

  return nombre.trim().slice(0, 2).toUpperCase() || "<>";
}

function obtenerApariencia(
  nombre: string
): AparienciaTecnologia {
  const clave = normalizarNombre(nombre);

  if (clave.includes("react")) {
    return {
      icono: "⚛",
      clases:
        "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
    };
  }

  if (clave.includes("nextjs") || clave === "next") {
    return {
      icono: "N",
      clases:
        "border-slate-500/50 bg-white/10 text-white",
    };
  }

  if (clave.includes("typescript")) {
    return {
      icono: "TS",
      clases:
        "border-blue-400/30 bg-blue-500/10 text-blue-100",
    };
  }

  if (clave.includes("javascript")) {
    return {
      icono: "JS",
      clases:
        "border-yellow-400/30 bg-yellow-500/10 text-yellow-100",
    };
  }

  if (clave.includes("tailwind")) {
    return {
      icono: "TW",
      clases:
        "border-cyan-300/30 bg-cyan-400/10 text-cyan-100",
    };
  }

  if (clave.includes("python")) {
    return {
      icono: "Py",
      clases:
        "border-amber-400/30 bg-amber-500/10 text-amber-100",
    };
  }

  if (clave.includes("fastapi")) {
    return {
      icono: "FA",
      clases:
        "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
    };
  }

  if (clave.includes("mysql")) {
    return {
      icono: "My",
      clases:
        "border-sky-400/30 bg-sky-500/10 text-sky-100",
    };
  }

  if (clave.includes("postgres")) {
    return {
      icono: "PG",
      clases:
        "border-indigo-400/30 bg-indigo-500/10 text-indigo-100",
    };
  }

  if (clave.includes("sqlmodel")) {
    return {
      icono: "SM",
      clases:
        "border-violet-400/30 bg-violet-500/10 text-violet-100",
    };
  }

  if (clave.includes("sqlalchemy")) {
    return {
      icono: "SA",
      clases:
        "border-rose-400/30 bg-rose-500/10 text-rose-100",
    };
  }

  if (clave.includes("nodejs") || clave === "node") {
    return {
      icono: "Node",
      clases:
        "border-lime-400/30 bg-lime-500/10 text-lime-100",
    };
  }

  if (clave.includes("vite")) {
    return {
      icono: "V",
      clases:
        "border-purple-400/30 bg-purple-500/10 text-purple-100",
    };
  }

  if (clave.includes("html")) {
    return {
      icono: "H5",
      clases:
        "border-orange-400/30 bg-orange-500/10 text-orange-100",
    };
  }

  if (clave.includes("css")) {
    return {
      icono: "C3",
      clases:
        "border-blue-400/30 bg-blue-500/10 text-blue-100",
    };
  }

  if (clave.includes("github")) {
    return {
      icono: "GH",
      clases:
        "border-slate-400/40 bg-slate-500/10 text-slate-100",
    };
  }

  if (clave === "git") {
    return {
      icono: "Git",
      clases:
        "border-orange-400/30 bg-orange-500/10 text-orange-100",
    };
  }

  if (clave.includes("docker")) {
    return {
      icono: "DK",
      clases:
        "border-sky-400/30 bg-sky-500/10 text-sky-100",
    };
  }

  if (clave.includes("php")) {
    return {
      icono: "PHP",
      clases:
        "border-indigo-400/30 bg-indigo-500/10 text-indigo-100",
    };
  }

  if (clave.includes("wordpress")) {
    return {
      icono: "W",
      clases:
        "border-sky-400/30 bg-sky-500/10 text-sky-100",
    };
  }

  if (clave.includes("xampp")) {
    return {
      icono: "X",
      clases:
        "border-orange-400/30 bg-orange-500/10 text-orange-100",
    };
  }

  if (clave.includes("mongodb")) {
    return {
      icono: "M",
      clases:
        "border-green-400/30 bg-green-500/10 text-green-100",
    };
  }

  if (clave.includes("vercel")) {
    return {
      icono: "▲",
      clases:
        "border-slate-500/50 bg-white/10 text-white",
    };
  }

  return {
    icono: obtenerIniciales(nombre),
    clases:
      "border-slate-600 bg-slate-800/70 text-slate-200",
  };
}

export default function TecnologiaBadge({
  nombre,
  compacta = false,
}: TecnologiaBadgeProps) {
  const apariencia = obtenerApariencia(nombre);

  return (
    <span
      title={nombre}
      className={`inline-flex items-center rounded-full border font-semibold ${apariencia.clases} ${
        compacta
          ? "gap-1.5 py-1 pl-1 pr-2.5 text-[11px]"
          : "gap-2 py-1.5 pl-1.5 pr-3 text-xs"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-950/55 font-mono font-bold text-current ${
          compacta
            ? "h-5 min-w-5 px-1 text-[9px]"
            : "h-6 min-w-6 px-1.5 text-[10px]"
        }`}
      >
        {apariencia.icono}
      </span>

      <span className="max-w-28 truncate">
        {nombre}
      </span>
    </span>
  );
}