"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { actualizarCertificacion } from "@/services/certificaciones";
import type { Certificacion } from "@/types/Certificacion";

interface EditarCertificacionFormProps {
  certificacion: Certificacion;

  onCertificacionActualizada: (
    certificacion: Certificacion
  ) => void;

  onCancelar: () => void;
}

export default function EditarCertificacionForm({
  certificacion,
  onCertificacionActualizada,
  onCancelar,
}: EditarCertificacionFormProps) {
  const [nombreCertificacion, setNombreCertificacion] =
    useState(certificacion.nombre_certificacion);

  const [descripcion, setDescripcion] = useState(
    certificacion.descripcion ?? ""
  );

  const [institucion, setInstitucion] = useState(
    certificacion.institucion ?? ""
  );

  const [fechaObtencion, setFechaObtencion] = useState(
    certificacion.fecha_obtencion
  );

  const [imagen, setImagen] = useState(
    certificacion.imagen ?? ""
  );

  const [estado, setEstado] = useState<
    Certificacion["estado"]
  >(certificacion.estado);

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

      const certificacionActualizada =
        await actualizarCertificacion(
          certificacion.id,
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

      onCertificacionActualizada(
        certificacionActualizada
      );
    } catch (errorDesconocido) {
      const mensaje =
        errorDesconocido instanceof Error
          ? errorDesconocido.message
          : "Ocurrió un error al actualizar la certificación.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  }

  return (
    <form
      onSubmit={manejarEnvio}
      className="space-y-5"
    >
      <div className="flex gap-5">
        <div>
          <label
            htmlFor={`nombre-certificacion-${certificacion.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Nombre de la certificación
          </label>

          <input
            id={`nombre-certificacion-${certificacion.id}`}
            type="text"
            value={nombreCertificacion}
            onChange={(event) =>
              setNombreCertificacion(event.target.value)
            }
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor={`institucion-certificacion-${certificacion.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Institución
          </label>

          <input
            id={`institucion-certificacion-${certificacion.id}`}
            type="text"
            value={institucion}
            onChange={(event) =>
              setInstitucion(event.target.value)
            }
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div>
          <label
            htmlFor={`fecha-certificacion-${certificacion.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Fecha de obtención
          </label>

          <input
            id={`fecha-certificacion-${certificacion.id}`}
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
            htmlFor={`estado-certificacion-${certificacion.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Estado
          </label>

          <select
            id={`estado-certificacion-${certificacion.id}`}
            value={estado}
            onChange={(event) =>
              setEstado(
                event.target
                  .value as Certificacion["estado"]
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
            htmlFor={`descripcion-certificacion-${certificacion.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <textarea
            id={`descripcion-certificacion-${certificacion.id}`}
            value={descripcion}
            onChange={(event) =>
              setDescripcion(event.target.value)
            }
            rows={4}
            disabled={cargando}
            className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor={`imagen-certificacion-${certificacion.id}`}
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            URL o ruta de la imagen
          </label>

          <input
            id={`imagen-certificacion-${certificacion.id}`}
            type="text"
            value={imagen}
            onChange={(event) =>
              setImagen(event.target.value)
            }
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>
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