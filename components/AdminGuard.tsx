"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { obtenerUsuarioActual } from "@/services/auth";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({
  children,
}: AdminGuardProps) {
  const router = useRouter();

  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    let componenteActivo = true;

    async function validarSesion() {
      const token = sessionStorage.getItem("access_token");

      if (!token) {
        if (componenteActivo) {
          setVerificando(false);
        }

        router.replace("/login");
        return;
      }

      try {
        const usuario = await obtenerUsuarioActual(token);

        console.log("Usuario autenticado:", usuario);

        if (componenteActivo) {
          setAutorizado(true);
        }
      } catch (error) {
        console.error("Sesión inválida:", error);

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("token_type");

        if (componenteActivo) {
          setAutorizado(false);
        }

        router.replace("/login");
      } finally {
        if (componenteActivo) {
          setVerificando(false);
        }
      }
    }

    void validarSesion();

    return () => {
      componenteActivo = false;
    };
  }, [router]);

  if (verificando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-sm font-medium text-slate-300">
          Verificando sesión...
        </p>
      </main>
    );
  }

  if (!autorizado) {
    return null;
  }

  return <>{children}</>;
}