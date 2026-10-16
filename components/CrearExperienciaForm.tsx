"use client";

import {
    type ChangeEvent,
    type FormEvent,
    useState,
} from "react";

import { crearExperiencia } from "@/services/experiencia";
import type {
    Experiencia,
    ExperienciaCreate,
} from "@/types/Experiencia";


interface CrearExperienciaFormProps {
    onExperienciaCreada: (experiencia: Experiencia) => void;
}


interface FormularioExperiencia {
    empresa: string;
    cargo: string;
    descripcion: string;
    ubicacion: string;
    tecnologias: string;
    logo: string;
    url_empresa: string;
    fecha_inicio: string;
    fecha_fin: string;
    trabajo_actual: boolean;
    orden: string;
    publicado: boolean;
}


const formularioInicial: FormularioExperiencia = {
    empresa: "",
    cargo: "",
    descripcion: "",
    ubicacion: "",
    tecnologias: "",
    logo: "",
    url_empresa: "",
    fecha_inicio: "",
    fecha_fin: "",
    trabajo_actual: false,
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


export default function CrearExperienciaForm({
    onExperienciaCreada,
}: CrearExperienciaFormProps) {
    const [formulario, setFormulario] =
        useState<FormularioExperiencia>(
            formularioInicial
        );

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState<string | null>(null);


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


    function manejarTrabajoActual(
        event: ChangeEvent<HTMLInputElement>
    ) {
        const { checked } = event.target;

        setFormulario((formularioActual) => ({
            ...formularioActual,
            trabajo_actual: checked,
            // Si marca "trabajo actual", limpiamos fecha_fin
            fecha_fin: checked ? "" : formularioActual.fecha_fin,
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

            if (!formulario.fecha_inicio) {
                throw new Error(
                    "Debes seleccionar la fecha de inicio."
                );
            }

            if (
                !formulario.trabajo_actual &&
                !formulario.fecha_fin
            ) {
                throw new Error(
                    "Debes seleccionar la fecha de término o marcar 'Trabajo actual'."
                );
            }

            const orden = Number(formulario.orden);

            if (!Number.isInteger(orden) || orden < 0) {
                throw new Error(
                    "El orden debe ser un número entero mayor o igual a cero."
                );
            }

            const token = sessionStorage.getItem(
                "access_token"
            );

            if (!token) {
                throw new Error(
                    "No existe una sesión válida. Vuelve a iniciar sesión."
                );
            }

            const datosExperiencia: ExperienciaCreate = {
                empresa: formulario.empresa.trim(),
                cargo: formulario.cargo.trim(),
                descripcion: formulario.descripcion.trim(),
                ubicacion: normalizarCampoOpcional(
                    formulario.ubicacion
                ),
                tecnologias: normalizarCampoOpcional(
                    formulario.tecnologias
                ),
                logo: normalizarCampoOpcional(
                    formulario.logo
                ),
                url_empresa: normalizarCampoOpcional(
                    formulario.url_empresa
                ),
                fecha_inicio: formulario.fecha_inicio,
                fecha_fin: formulario.trabajo_actual
                    ? null
                    : formulario.fecha_fin,
                trabajo_actual: formulario.trabajo_actual,
                orden,
                publicado: formulario.publicado,
            };

            const experienciaCreada = await crearExperiencia(
                datosExperiencia,
                token
            );

            onExperienciaCreada(experienciaCreada);
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
                    Nueva experiencia
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Agregar experiencia laboral
                </h2>

                <p className="mt-2 text-slate-600">
                    Ingresa la información del cargo o trabajo que
                    se mostrará en tu portafolio.
                </p>
            </div>


            {error && (
                <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
                >
                    <p className="font-semibold text-red-800">
                        No fue posible crear la experiencia
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
                            htmlFor="empresa"
                            className="font-semibold text-slate-800"
                        >
                            Empresa
                        </label>

                        <input
                            id="empresa"
                            name="empresa"
                            type="text"
                            value={formulario.empresa}
                            onChange={manejarCampoTexto}
                            minLength={2}
                            maxLength={120}
                            required
                            disabled={enviando}
                            placeholder="Ejemplo: Inventaria"
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            htmlFor="cargo"
                            className="font-semibold text-slate-800"
                        >
                            Cargo
                        </label>

                        <input
                            id="cargo"
                            name="cargo"
                            type="text"
                            value={formulario.cargo}
                            onChange={manejarCampoTexto}
                            minLength={2}
                            maxLength={120}
                            required
                            disabled={enviando}
                            placeholder="Ejemplo: Desarrollador Full Stack"
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
                        placeholder="Describe tus responsabilidades y logros en este rol."
                        className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                    />
                </div>


                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            htmlFor="ubicacion"
                            className="font-semibold text-slate-800"
                        >
                            Ubicación
                        </label>

                        <input
                            id="ubicacion"
                            name="ubicacion"
                            type="text"
                            value={formulario.ubicacion}
                            onChange={manejarCampoTexto}
                            maxLength={120}
                            disabled={enviando}
                            placeholder="Viña del Mar, Chile"
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            htmlFor="tecnologias"
                            className="font-semibold text-slate-800"
                        >
                            Tecnologías utilizadas
                        </label>

                        <input
                            id="tecnologias"
                            name="tecnologias"
                            type="text"
                            value={formulario.tecnologias}
                            onChange={manejarCampoTexto}
                            maxLength={500}
                            disabled={enviando}
                            placeholder="Python, FastAPI, MySQL"
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            htmlFor="logo"
                            className="font-semibold text-slate-800"
                        >
                            Logo o ruta de imagen
                        </label>

                        <input
                            id="logo"
                            name="logo"
                            type="text"
                            value={formulario.logo}
                            onChange={manejarCampoTexto}
                            maxLength={255}
                            disabled={enviando}
                            placeholder="/images/empresa.png"
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />

                        <p className="text-sm text-slate-500">
                            Campo opcional. Si lo dejas vacío, se mostrará
                            la inicial de la empresa.
                        </p>
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            htmlFor="url_empresa"
                            className="font-semibold text-slate-800"
                        >
                            URL del sitio de la empresa
                        </label>

                        <input
                            id="url_empresa"
                            name="url_empresa"
                            type="url"
                            value={formulario.url_empresa}
                            onChange={manejarCampoTexto}
                            maxLength={255}
                            disabled={enviando}
                            placeholder="https://empresa.com"
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            htmlFor="fecha_inicio"
                            className="font-semibold text-slate-800"
                        >
                            Fecha de inicio
                        </label>

                        <input
                            id="fecha_inicio"
                            name="fecha_inicio"
                            type="date"
                            value={formulario.fecha_inicio}
                            onChange={manejarCampoTexto}
                            required
                            disabled={enviando}
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-2">
                        <label
                            htmlFor="fecha_fin"
                            className="font-semibold text-slate-800"
                        >
                            Fecha de término
                        </label>

                        <input
                            id="fecha_fin"
                            name="fecha_fin"
                            type="date"
                            value={formulario.fecha_fin}
                            onChange={manejarCampoTexto}
                            disabled={
                                enviando || formulario.trabajo_actual
                            }
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />

                        <label className="mt-2 flex cursor-pointer items-center gap-2">
                            <input
                                name="trabajo_actual"
                                type="checkbox"
                                checked={formulario.trabajo_actual}
                                onChange={manejarTrabajoActual}
                                disabled={enviando}
                                className="h-5 w-5 rounded border-slate-300"
                            />

                            <span className="text-sm text-slate-600">
                                Trabajo actual (sin fecha de término)
                            </span>
                        </label>
                    </div>
                </div>


                <div className="flex flex-col gap-6 lg:flex-row">
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
                            onChange={manejarCampoTexto}
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

                    <div className="flex flex-1 flex-col justify-end rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <label className="flex cursor-pointer items-center gap-3">
                            <input
                                name="publicado"
                                type="checkbox"
                                checked={formulario.publicado}
                                onChange={manejarPublicado}
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
                            ? "Creando experiencia..."
                            : "Agregar experiencia"}
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