"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { crearServicio } from "@/services/servicios";
import type { Servicio } from "@/types/Servicio";

interface CrearServicioFormProps {
  onServicioCreado: (servicio: Servicio) => void;
}

export default function CrearServicioForm({
  onServicioCreado,
}: CrearServicioFormProps) {
  const [nombreServicio, setNombreServicio] = useState("");
  const [valor, setValor] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function manejarEnvio(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const nombreLimpio = nombreServicio.trim();
    const valorNumerico = Number(valor);

    if (!nombreLimpio) {
      setError("Debes ingresar el nombre del servicio.");
      return;
    }

    if (
      !Number.isFinite(valorNumerico) ||
      valorNumerico <= 0
    ) {
      setError("El valor debe ser mayor que cero.");
      return;
    }

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setError(
        "No existe una sesión válida. Vuelve a iniciar sesión."
      );
      return;
    }

    try {
      setCargando(true);

      const servicioCreado = await crearServicio(
        {
          Nombre_servicio: nombreLimpio,
          valor: valorNumerico,
        },
        token
      );

      onServicioCreado(servicioCreado);

      setNombreServicio("");
      setValor("");
    } catch (errorDesconocido) {
      const mensaje =
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error al crear el servicio.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={manejarEnvio}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-slate-900">
        Agregar servicio
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Ingresa la información del nuevo servicio.
      </p>

      <div className="mt-6 flex gap-5">
        <div>
          <label
            htmlFor="nombre-servicio"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nombre del servicio
          </label>

          <input
            id="nombre-servicio"
            type="text"
            value={nombreServicio}
            onChange={(event) =>
              setNombreServicio(event.target.value)
            }
            placeholder="Ejemplo: Soporte TI remoto"
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="valor-servicio"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Valor
          </label>

          <input
            id="valor-servicio"
            type="number"
            min="1"
            step="1"
            value={valor}
            onChange={(event) =>
              setValor(event.target.value)
            }
            placeholder="Ejemplo: 25000"
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando
          ? "Guardando servicio..."
          : "Agregar servicio"}
      </button>
    </form>
  );
}