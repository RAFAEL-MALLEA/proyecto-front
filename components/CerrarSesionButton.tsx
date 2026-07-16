"use client";

import { useRouter } from "next/navigation";

export default function CerrarSesionButton() {
  const router = useRouter();

  function cerrarSesion() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("token_type");

    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={cerrarSesion}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  );
}