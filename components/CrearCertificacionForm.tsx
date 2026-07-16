"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { crearCertificacion } from "@/services/certificaciones";
import type {
  Certificacion,
  CertificacionCreate,
} from "@/types/Certificacion";

interface CrearCertificacionFormProps {
  onCertificacionCreada: (
    certificacion: Certificacion
  ) => void;
}

export default function CrearCertificacionForm({
  onCertificacionCreada,
}: CrearCertificacionFormProps) {
  const [nombreCertificacion, setNombreCertificacion] =
    useState("");

  const [descripcion, setDescripcion] = useState("");
  const [institucion, setInstitucion] = useState("");
  const [fechaObtencion, setFechaObtencion] = useState("");
  const [imagen, setImagen] = useState("");

  const [estado, setEstado] =
    useState<CertificacionCreate["estado"]>("Terminado");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function manejarEnvio(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    const nombreLimpio = nombreCertificacion.trim();

    if (!nombreLimpio) {
      setError(
        "Debes ingresar el nombre de la certificación."
      );
      return;
    }

    if (!fechaObtencion) {
      setError(
        "Debes seleccionar la fecha de obtención."
      );
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

      const certificacionCreada =
        await crearCertificacion(
          {
            nombre_certificacion: nombreLimpio,
            descripcion: descripcion.trim() || null,
            institucion: institucion.trim() || null,
            fecha_obtencion: fechaObtencion,
            imagen: imagen.trim() || null,
            estado,
          },
          token
        );

      onCertificacionCreada(certificacionCreada);

      setNombreCertificacion("");
      setDescripcion("");
      setInstitucion("");
      setFechaObtencion("");
      setImagen("");
      setEstado("Terminado");
    } catch (errorDesconocido) {
      const mensaje =
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error al crear la certificación.";

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
        Agregar certificación
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Ingresa la información de la nueva certificación.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="nombre-certificacion"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nombre de la certificación
          </label>

          <input
            id="nombre-certificacion"
            type="text"
            value={nombreCertificacion}
            onChange={(event) =>
              setNombreCertificacion(event.target.value)
            }
            placeholder="Ejemplo: Python Essentials 1"
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="institucion-certificacion"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Institución
          </label>

          <input
            id="institucion-certificacion"
            type="text"
            value={institucion}
            onChange={(event) =>
              setInstitucion(event.target.value)
            }
            placeholder="Ejemplo: Cisco"
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="fecha-certificacion"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Fecha de obtención
          </label>

          <input
            id="fecha-certificacion"
            type="date"
            value={fechaObtencion}
            onChange={(event) =>
              setFechaObtencion(event.target.value)
            }
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor="estado-certificacion"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Estado
          </label>

          <select
            id="estado-certificacion"
            value={estado}
            onChange={(event) =>
              setEstado(
                event.target
                  .value as CertificacionCreate["estado"]
              )
            }
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          >
            <option value="Terminado">
              Terminado
            </option>

            <option value="Completado">
              Completado
            </option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="descripcion-certificacion"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <textarea
            id="descripcion-certificacion"
            value={descripcion}
            onChange={(event) =>
              setDescripcion(event.target.value)
            }
            placeholder="Describe brevemente la certificación"
            disabled={cargando}
            rows={4}
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="imagen-certificacion"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            URL o ruta de la imagen
          </label>

          <input
            id="imagen-certificacion"
            type="text"
            value={imagen}
            onChange={(event) =>
              setImagen(event.target.value)
            }
            placeholder="Ejemplo: /certificaciones/python.png"
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
          ? "Guardando certificación..."
          : "Agregar certificación"}
      </button>
    </form>
  );
}