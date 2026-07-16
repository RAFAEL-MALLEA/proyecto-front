"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { actualizarServicio } from "@/services/servicios";
import type { Servicio } from "@/types/Servicio";

interface EditarServicioFormProps {
  servicio: Servicio;
  onServicioActualizado: (servicio: Servicio) => void;
  onCancelar: () => void;
}

export default function EditarServicioForm({
  servicio,
  onServicioActualizado,
  onCancelar,
}: EditarServicioFormProps) {
  const [nombreServicio, setNombreServicio] = useState(
    servicio.Nombre_servicio
  );

  const [valor, setValor] = useState(
    String(servicio.valor)
  );

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

      const servicioActualizado =
        await actualizarServicio(
          servicio.id,
          {
            Nombre_servicio: nombreLimpio,
            valor: valorNumerico,
          },
          token
        );

      onServicioActualizado(servicioActualizado);
    } catch (errorDesconocido) {
      const mensaje =
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error al actualizar el servicio.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={manejarEnvio}
      className="space-y-4"
    >
      <div>
        <label
          htmlFor={`nombre-servicio-${servicio.id}`}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nombre del servicio
        </label>

        <input
          id={`nombre-servicio-${servicio.id}`}
          type="text"
          value={nombreServicio}
          onChange={(event) =>
            setNombreServicio(event.target.value)
          }
          disabled={cargando}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label
          htmlFor={`valor-servicio-${servicio.id}`}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Valor
        </label>

        <input
          id={`valor-servicio-${servicio.id}`}
          type="number"
          min="1"
          step="1"
          value={valor}
          onChange={(event) =>
            setValor(event.target.value)
          }
          disabled={cargando}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={cargando}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando
            ? "Guardando cambios..."
            : "Guardar cambios"}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          disabled={cargando}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}