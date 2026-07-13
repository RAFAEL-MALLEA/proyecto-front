"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { iniciarSesion } from "@/services/auth";


export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setCargando(true);
    setError(null);

    try {
      const respuesta = await iniciarSesion({
        email,
        password,
      });

      sessionStorage.setItem(
        "access_token",
        respuesta.access_token
      );

      sessionStorage.setItem( 
        "token_type",
        respuesta.token_type
      );

      router.replace("/admin");
    } catch (errorDesconocido) {
      const mensaje =
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error inesperado.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={manejarEnvio}
      className="flex flex-col gap-6"
    >
      <header className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Panel de administración
        </h1>

        <p className="text-sm text-slate-500">
          Ingresa tus credenciales para continuar.
        </p>
      </header>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-slate-700"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="correo@ejemplo.com"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-slate-700"
        >
          Contraseña
        </label>

        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
          placeholder="Ingresa tu contraseña"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {error && (
        <p
          role="alert"
          aria-live="polite"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={
          cargando ||
          email.trim() === "" ||
          password === ""
        }
        className="rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cargando
          ? "Iniciando sesión..."
          : "Iniciar sesión"}
      </button>
    </form>
  );
}