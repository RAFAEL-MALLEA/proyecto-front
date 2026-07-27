"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import { actualizarTecnologia } from "@/services/tecnologias";
import type {
  Tecnologia,
  TecnologiaUpdate,
} from "@/types/Tecnologia";


interface EditarTecnologiaFormProps {
  tecnologia: Tecnologia;
  onTecnologiaActualizada: (
    tecnologia: Tecnologia
  ) => void;
  onCancelar: () => void;
}


interface FormularioTecnologia {
  nombre: string;
  categoria: string;
  nivel: string;
  descripcion: string;
  icono: string;
  color: string;
  orden: string;
  publicado: boolean;
}


function crearFormularioInicial(
  tecnologia: Tecnologia
): FormularioTecnologia {
  return {
    nombre: tecnologia.nombre,
    categoria: tecnologia.categoria,
    nivel: String(tecnologia.nivel),
    descripcion: tecnologia.descripcion ?? "",
    icono: tecnologia.icono ?? "",
    color: tecnologia.color ?? "",
    orden: String(tecnologia.orden),
    publicado: tecnologia.publicado,
  };
}


function normalizarCampoOpcional(
  valor: string
): string | null {
  const valorLimpio = valor.trim();

  return valorLimpio || null;
}


function obtenerMensajeError(
  errorDesconocido: unknown
): string {
  return errorDesconocido instanceof Error
    ? errorDesconocido.message
    : "Ocurrió un error inesperado.";
}


export default function EditarTecnologiaForm({
  tecnologia,
  onTecnologiaActualizada,
  onCancelar,
}: EditarTecnologiaFormProps) {
  const [formulario, setFormulario] =
    useState<FormularioTecnologia>(() =>
      crearFormularioInicial(tecnologia)
    );

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);


  function manejarCampo(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));
  }


  function manejarPublicado(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setFormulario((formularioActual) => ({
      ...formularioActual,
      publicado: event.target.checked,
    }));
  }


  async function manejarEnvio(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError(null);

      const nivel = Number(formulario.nivel);
      const orden = Number(formulario.orden);

      if (![1, 2, 3].includes(nivel)) {
        throw new Error(
          "Selecciona un nivel válido."
        );
      }

      if (!Number.isInteger(orden) || orden < 0) {
        throw new Error(
          "El orden debe ser un número entero mayor o igual a cero."
        );
      }

      const cambios: TecnologiaUpdate = {
        nombre: formulario.nombre.trim(),
        categoria: formulario.categoria.trim(),
        nivel,
        descripcion: normalizarCampoOpcional(
          formulario.descripcion
        ),
        icono: normalizarCampoOpcional(
          formulario.icono
        ),
        color: normalizarCampoOpcional(
          formulario.color
        ),
        orden,
        publicado: formulario.publicado,
      };

      const tecnologiaActualizada =
        await actualizarTecnologia(
          tecnologia.id,
          cambios
        );

      onTecnologiaActualizada(
        tecnologiaActualizada
      );
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setGuardando(false);
    }
  }


  return (
    <section
      id="formulario-edicion-tecnologia"
      className="scroll-mt-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Editando tecnología #{tecnologia.id}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {tecnologia.nombre}
          </h2>

          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Modifica los campos necesarios y guarda los
            cambios en el portafolio.
          </p>
        </div>

        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar edición
        </button>
      </div>


      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
        >
          <p className="font-semibold text-red-800">
            No fue posible actualizar la tecnología
          </p>

          <p className="mt-1 text-sm text-red-700">
            {error}
          </p>
        </div>
      )}


      <form
        onSubmit={manejarEnvio}
        className="mt-8 flex flex-col gap-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-nombre-${tecnologia.id}`}
              className="font-semibold text-slate-800"
            >
              Nombre
            </label>

            <input
              id={`editar-nombre-${tecnologia.id}`}
              name="nombre"
              type="text"
              value={formulario.nombre}
              onChange={manejarCampo}
              minLength={2}
              maxLength={80}
              required
              disabled={guardando}
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-categoria-${tecnologia.id}`}
              className="font-semibold text-slate-800"
            >
              Categoría
            </label>

            <input
              id={`editar-categoria-${tecnologia.id}`}
              name="categoria"
              type="text"
              value={formulario.categoria}
              onChange={manejarCampo}
              minLength={2}
              maxLength={60}
              required
              disabled={guardando}
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-nivel-${tecnologia.id}`}
              className="font-semibold text-slate-800"
            >
              Nivel
            </label>

            <select
              id={`editar-nivel-${tecnologia.id}`}
              name="nivel"
              value={formulario.nivel}
              onChange={manejarCampo}
              disabled={guardando}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="1">Básico</option>
              <option value="2">Intermedio</option>
              <option value="3">Avanzado</option>
            </select>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-orden-${tecnologia.id}`}
              className="font-semibold text-slate-800"
            >
              Orden de visualización
            </label>

            <input
              id={`editar-orden-${tecnologia.id}`}
              name="orden"
              type="number"
              value={formulario.orden}
              onChange={manejarCampo}
              min={0}
              step={1}
              required
              disabled={guardando}
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <label
            htmlFor={`editar-descripcion-${tecnologia.id}`}
            className="font-semibold text-slate-800"
          >
            Descripción
          </label>

          <textarea
            id={`editar-descripcion-${tecnologia.id}`}
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCampo}
            maxLength={500}
            disabled={guardando}
            rows={4}
            className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-icono-${tecnologia.id}`}
              className="font-semibold text-slate-800"
            >
              Icono o ruta del icono
            </label>

            <input
              id={`editar-icono-${tecnologia.id}`}
              name="icono"
              type="text"
              value={formulario.icono}
              onChange={manejarCampo}
              maxLength={255}
              disabled={guardando}
              placeholder="/icons/react.svg"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-color-${tecnologia.id}`}
              className="font-semibold text-slate-800"
            >
              Color identificador
            </label>

            <div className="flex items-center gap-3">
              <input
                id={`editar-color-${tecnologia.id}`}
                name="color"
                type="text"
                value={formulario.color}
                onChange={manejarCampo}
                maxLength={20}
                disabled={guardando}
                placeholder="#61DAFB"
                pattern="^#[0-9A-Fa-f]{6}$"
                title="Utiliza un color hexadecimal como #61DAFB"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <span
                aria-label="Vista previa del color"
                className="h-11 w-11 shrink-0 rounded-lg border border-slate-300 bg-slate-100"
                style={
                  /^#[0-9A-Fa-f]{6}$/.test(
                    formulario.color
                  )
                    ? {
                        backgroundColor:
                          formulario.color,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>


        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input
            name="publicado"
            type="checkbox"
            checked={formulario.publicado}
            onChange={manejarPublicado}
            disabled={guardando}
            className="mt-1 h-5 w-5 rounded border-slate-300"
          />

          <span>
            <span className="block font-semibold text-slate-800">
              Tecnología publicada
            </span>

            <span className="text-sm leading-6 text-slate-500">
              Desmárcala para guardarla como borrador.
            </span>
          </span>
        </label>


        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={guardando}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {guardando
              ? "Guardando cambios..."
              : "Guardar cambios"}
          </button>

          <button
            type="button"
            disabled={guardando}
            onClick={() => {
              setFormulario(
                crearFormularioInicial(tecnologia)
              );
              setError(null);
            }}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Restaurar valores
          </button>
        </div>
      </form>
    </section>
  );
}