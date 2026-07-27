"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import { actualizarProyecto } from "@/services/proyectos";
import type {
  Proyecto,
  ProyectoUpdate,
} from "@/types/Proyecto";


interface EditarProyectoFormProps {
  proyecto: Proyecto;
  onProyectoActualizado: (
    proyecto: Proyecto
  ) => void;
  onCancelar: () => void;
}


interface FormularioProyecto {
  titulo: string;
  descripcion: string;
  tecnologias: string;
  imagen: string;
  url_repositorio: string;
  url_demo: string;
  destacado: boolean;
  publicado: boolean;
}


function crearFormularioInicial(
  proyecto: Proyecto
): FormularioProyecto {
  return {
    titulo: proyecto.titulo,
    descripcion: proyecto.descripcion,
    tecnologias: proyecto.tecnologias,
    imagen: proyecto.imagen ?? "",
    url_repositorio:
      proyecto.url_repositorio ?? "",
    url_demo: proyecto.url_demo ?? "",
    destacado: proyecto.destacado,
    publicado: proyecto.publicado,
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


export default function EditarProyectoForm({
  proyecto,
  onProyectoActualizado,
  onCancelar,
}: EditarProyectoFormProps) {
  const [formulario, setFormulario] =
    useState<FormularioProyecto>(() =>
      crearFormularioInicial(proyecto)
    );

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);


  function manejarCampoTexto(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));
  }


  function manejarCampoBooleano(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const { name, checked } = event.target;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: checked,
    }));
  }


  async function manejarEnvio(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setGuardando(true);
      setError(null);

      const cambios: ProyectoUpdate = {
        titulo: formulario.titulo.trim(),
        descripcion:
          formulario.descripcion.trim(),
        tecnologias:
          formulario.tecnologias.trim(),
        imagen: normalizarCampoOpcional(
          formulario.imagen
        ),
        url_repositorio:
          normalizarCampoOpcional(
            formulario.url_repositorio
          ),
        url_demo: normalizarCampoOpcional(
          formulario.url_demo
        ),
        destacado: formulario.destacado,
        publicado: formulario.publicado,
      };

      const proyectoActualizado =
        await actualizarProyecto(
          proyecto.id,
          cambios
        );

      onProyectoActualizado(
        proyectoActualizado
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
      id="formulario-edicion-proyecto"
      className="scroll-mt-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Editando proyecto #{proyecto.id}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            {proyecto.titulo}
          </h2>

          <p className="mt-2 text-slate-600">
            Modifica los campos necesarios y guarda
            los cambios.
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
            No fue posible actualizar el proyecto
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
              htmlFor={`editar-titulo-${proyecto.id}`}
              className="font-semibold text-slate-800"
            >
              Título
            </label>

            <input
              id={`editar-titulo-${proyecto.id}`}
              name="titulo"
              type="text"
              value={formulario.titulo}
              onChange={manejarCampoTexto}
              minLength={3}
              maxLength={120}
              required
              disabled={guardando}
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-tecnologias-${proyecto.id}`}
              className="font-semibold text-slate-800"
            >
              Tecnologías
            </label>

            <input
              id={`editar-tecnologias-${proyecto.id}`}
              name="tecnologias"
              type="text"
              value={formulario.tecnologias}
              onChange={manejarCampoTexto}
              minLength={2}
              maxLength={500}
              required
              disabled={guardando}
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        </div>


        <div className="flex flex-col gap-2">
          <label
            htmlFor={`editar-descripcion-${proyecto.id}`}
            className="font-semibold text-slate-800"
          >
            Descripción
          </label>

          <textarea
            id={`editar-descripcion-${proyecto.id}`}
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCampoTexto}
            minLength={10}
            maxLength={1500}
            required
            disabled={guardando}
            rows={5}
            className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-imagen-${proyecto.id}`}
              className="font-semibold text-slate-800"
            >
              Imagen o ruta de imagen
            </label>

            <input
              id={`editar-imagen-${proyecto.id}`}
              name="imagen"
              type="text"
              value={formulario.imagen}
              onChange={manejarCampoTexto}
              maxLength={255}
              disabled={guardando}
              placeholder="/images/proyecto.png"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-repositorio-${proyecto.id}`}
              className="font-semibold text-slate-800"
            >
              URL del repositorio
            </label>

            <input
              id={`editar-repositorio-${proyecto.id}`}
              name="url_repositorio"
              type="url"
              value={formulario.url_repositorio}
              onChange={manejarCampoTexto}
              maxLength={255}
              disabled={guardando}
              placeholder="https://github.com/usuario/proyecto"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor={`editar-demo-${proyecto.id}`}
              className="font-semibold text-slate-800"
            >
              URL de demostración
            </label>

            <input
              id={`editar-demo-${proyecto.id}`}
              name="url_demo"
              type="url"
              value={formulario.url_demo}
              onChange={manejarCampoTexto}
              maxLength={255}
              disabled={guardando}
              placeholder="https://mi-proyecto.vercel.app"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-1 flex-col justify-end gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                name="destacado"
                type="checkbox"
                checked={formulario.destacado}
                onChange={manejarCampoBooleano}
                disabled={guardando}
                className="h-5 w-5 rounded border-slate-300"
              />

              <span>
                <span className="block font-semibold text-slate-800">
                  Proyecto destacado
                </span>

                <span className="text-sm text-slate-500">
                  Tendrá prioridad en la sección pública.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                name="publicado"
                type="checkbox"
                checked={formulario.publicado}
                onChange={manejarCampoBooleano}
                disabled={guardando}
                className="h-5 w-5 rounded border-slate-300"
              />

              <span>
                <span className="block font-semibold text-slate-800">
                  Proyecto publicado
                </span>

                <span className="text-sm text-slate-500">
                  Desmárcalo para guardarlo como borrador.
                </span>
              </span>
            </label>
          </div>
        </div>


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
            onClick={() =>
              setFormulario(
                crearFormularioInicial(proyecto)
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Restaurar valores
          </button>
        </div>
      </form>
    </section>
  );
}