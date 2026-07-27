"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import { crearProyecto } from "@/services/proyectos";
import type {
  Proyecto,
  ProyectoCreate,
} from "@/types/Proyecto";


interface CrearProyectoFormProps {
  onProyectoCreado: (proyecto: Proyecto) => void;
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


const formularioInicial: FormularioProyecto = {
  titulo: "",
  descripcion: "",
  tecnologias: "",
  imagen: "",
  url_repositorio: "",
  url_demo: "",
  destacado: false,
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


export default function CrearProyectoForm({
  onProyectoCreado,
}: CrearProyectoFormProps) {
  const [formulario, setFormulario] =
    useState<FormularioProyecto>(
      formularioInicial
    );

  const [enviando, setEnviando] =
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
      setEnviando(true);
      setError(null);

      const datosProyecto: ProyectoCreate = {
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

      const proyectoCreado =
        await crearProyecto(datosProyecto);

      onProyectoCreado(proyectoCreado);
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
          Nuevo proyecto
        </p>

        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Agregar proyecto
        </h2>

        <p className="mt-2 text-slate-600">
          Ingresa la información que se mostrará en
          tu portafolio.
        </p>
      </div>


      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
        >
          <p className="font-semibold text-red-800">
            No fue posible crear el proyecto
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
              htmlFor="titulo"
              className="font-semibold text-slate-800"
            >
              Título
            </label>

            <input
              id="titulo"
              name="titulo"
              type="text"
              value={formulario.titulo}
              onChange={manejarCampoTexto}
              minLength={3}
              maxLength={120}
              required
              disabled={enviando}
              placeholder="Ejemplo: Portafolio Full Stack"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="tecnologias"
              className="font-semibold text-slate-800"
            >
              Tecnologías
            </label>

            <input
              id="tecnologias"
              name="tecnologias"
              type="text"
              value={formulario.tecnologias}
              onChange={manejarCampoTexto}
              minLength={2}
              maxLength={500}
              required
              disabled={enviando}
              placeholder="Next.js, FastAPI, MySQL"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
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
            onChange={manejarCampoTexto}
            minLength={10}
            maxLength={1500}
            required
            disabled={enviando}
            rows={5}
            placeholder="Describe el objetivo, las funciones y el resultado del proyecto."
            className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="imagen"
              className="font-semibold text-slate-800"
            >
              Imagen o ruta de imagen
            </label>

            <input
              id="imagen"
              name="imagen"
              type="text"
              value={formulario.imagen}
              onChange={manejarCampoTexto}
              maxLength={255}
              disabled={enviando}
              placeholder="/images/proyecto.png"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />

            <p className="text-sm text-slate-500">
              Campo opcional. Por ahora se guarda una
              ruta o URL, no el archivo.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="url_repositorio"
              className="font-semibold text-slate-800"
            >
              URL del repositorio
            </label>

            <input
              id="url_repositorio"
              name="url_repositorio"
              type="url"
              value={formulario.url_repositorio}
              onChange={manejarCampoTexto}
              maxLength={255}
              disabled={enviando}
              placeholder="https://github.com/usuario/proyecto"
              className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        </div>


        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <label
              htmlFor="url_demo"
              className="font-semibold text-slate-800"
            >
              URL de demostración
            </label>

            <input
              id="url_demo"
              name="url_demo"
              type="url"
              value={formulario.url_demo}
              onChange={manejarCampoTexto}
              maxLength={255}
              disabled={enviando}
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
                disabled={enviando}
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
                disabled={enviando}
                className="h-5 w-5 rounded border-slate-300"
              />

              <span>
                <span className="block font-semibold text-slate-800">
                  Publicar inmediatamente
                </span>

                <span className="text-sm text-slate-500">
                  Si no lo marcas, se guardará como borrador.
                </span>
              </span>
            </label>
          </div>
        </div>


        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={enviando}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando
              ? "Creando proyecto..."
              : "Agregar proyecto"}
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