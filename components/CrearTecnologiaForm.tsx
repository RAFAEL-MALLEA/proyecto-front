"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import { crearTecnologia } from "@/services/tecnologias";
import type {
  Tecnologia,
  TecnologiaCreate,
} from "@/types/Tecnologia";


interface CrearTecnologiaFormProps {
  onTecnologiaCreada: (
    tecnologia: Tecnologia
  ) => void;
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


const formularioInicial: FormularioTecnologia = {
  nombre: "",
  categoria: "",
  nivel: "2",
  descripcion: "",
  icono: "",
  color: "",
  orden: "0",
  publicado: false,
};


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


export default function CrearTecnologiaForm({
  onTecnologiaCreada,
}: CrearTecnologiaFormProps) {
  const [formulario, setFormulario] =
    useState<FormularioTecnologia>(
      formularioInicial
    );

  const [enviando, setEnviando] =
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
      setEnviando(true);
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

      const datosTecnologia: TecnologiaCreate = {
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

      const tecnologiaCreada =
        await crearTecnologia(datosTecnologia);

      onTecnologiaCreada(tecnologiaCreada);
      setFormulario(formularioInicial);
    } catch (errorDesconocido) {
      setError(
        obtenerMensajeError(errorDesconocido)
      );
    } finally {
      setEnviando(false);
    }
  }


  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Nueva tecnología
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Agregar tecnología
        </h2>

        <p className="mt-2 max-w-3xl leading-7 text-slate-600">
          Registra una herramienta, lenguaje, framework o
          plataforma utilizada en tu perfil profesional.
        </p>
      </div>


      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
        >
          <p className="font-semibold text-red-800">
            No fue posible crear la tecnología
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
              htmlFor="nombre"
              className="font-semibold text-slate-800"
            >
              Nombre
            </label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              value={formulario.nombre}
              onChange={manejarCampo}
              minLength={2}
              maxLength={80}
              required
              disabled={enviando}
              placeholder="Ejemplo: React"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="categoria"
              className="font-semibold text-slate-800"
            >
              Categoría
            </label>

            <input
              id="categoria"
              name="categoria"
              type="text"
              value={formulario.categoria}
              onChange={manejarCampo}
              minLength={2}
              maxLength={60}
              required
              disabled={enviando}
              placeholder="Frontend, Backend, Base de datos..."
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="nivel"
              className="font-semibold text-slate-800"
            >
              Nivel
            </label>

            <select
              id="nivel"
              name="nivel"
              value={formulario.nivel}
              onChange={manejarCampo}
              disabled={enviando}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            >
              <option value="1">Básico</option>
              <option value="2">Intermedio</option>
              <option value="3">Avanzado</option>
            </select>

            <p className="text-sm text-slate-500">
              La base de datos guardará 1, 2 o 3.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="orden"
              className="font-semibold text-slate-800"
            >
              Orden de visualización
            </label>

            <input
              id="orden"
              name="orden"
              type="number"
              value={formulario.orden}
              onChange={manejarCampo}
              min={0}
              step={1}
              required
              disabled={enviando}
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

            <p className="text-sm text-slate-500">
              Los números menores aparecerán primero.
            </p>
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <label
            htmlFor="descripcion"
            className="font-semibold text-slate-800"
          >
            Descripción
          </label>

          <textarea
            id="descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCampo}
            maxLength={500}
            disabled={enviando}
            rows={4}
            placeholder="Describe brevemente cómo utilizas esta tecnología."
            className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />

          <p className="text-sm text-slate-500">
            Campo opcional. Máximo 500 caracteres.
          </p>
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="icono"
              className="font-semibold text-slate-800"
            >
              Icono o ruta del icono
            </label>

            <input
              id="icono"
              name="icono"
              type="text"
              value={formulario.icono}
              onChange={manejarCampo}
              maxLength={255}
              disabled={enviando}
              placeholder="/icons/react.svg"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

            <p className="text-sm text-slate-500">
              Se guarda una ruta o URL, no el archivo.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="color"
              className="font-semibold text-slate-800"
            >
              Color identificador
            </label>

            <div className="flex items-center gap-3">
              <input
                id="color"
                name="color"
                type="text"
                value={formulario.color}
                onChange={manejarCampo}
                maxLength={20}
                disabled={enviando}
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

            <p className="text-sm text-slate-500">
              Campo opcional. Ejemplo: #61DAFB.
            </p>
          </div>
        </div>


        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <input
            name="publicado"
            type="checkbox"
            checked={formulario.publicado}
            onChange={manejarPublicado}
            disabled={enviando}
            className="mt-1 h-5 w-5 rounded border-slate-300"
          />

          <span>
            <span className="block font-semibold text-slate-800">
              Publicar inmediatamente
            </span>

            <span className="text-sm leading-6 text-slate-500">
              Si no lo marcas, la tecnología se guardará
              como borrador.
            </span>
          </span>
        </label>


        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={enviando}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando
              ? "Creando tecnología..."
              : "Agregar tecnología"}
          </button>

          <button
            type="button"
            disabled={enviando}
            onClick={() => {
              setFormulario(formularioInicial);
              setError(null);
            }}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Limpiar formulario
          </button>
        </div>
      </form>
    </section>
  );
}