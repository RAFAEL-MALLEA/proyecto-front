"use client";

import {
    type ChangeEvent,
    type FormEvent,
    useState,
} from "react";

import SelectorEmojis from "@/components/SelectorEmojis";
import { crearCompetenciaBlanda } from "@/services/competenciasBlandas";
import type {
    CompetenciaBlanda,
    CompetenciaBlandaCreate,
} from "@/types/CompetenciaBlanda";


interface CrearCompetenciaBlandaFormProps {
    onCompetenciaCreada: (
        competencia: CompetenciaBlanda
    ) => void;
}


interface FormularioCompetencia {
    nombre: string;
    descripcion: string;
    icono: string;
    orden: string;
    publicado: boolean;
}


const formularioInicial: FormularioCompetencia = {
    nombre: "",
    descripcion: "",
    icono: "",
    orden: "0",
    publicado: false,
};


function obtenerMensajeError(
    errorDesconocido: unknown
): string {
    return errorDesconocido instanceof Error
        ? errorDesconocido.message
        : "Ocurrió un error inesperado.";
}


export default function CrearCompetenciaBlandaForm({
    onCompetenciaCreada,
}: CrearCompetenciaBlandaFormProps) {
    const [formulario, setFormulario] =
        useState<FormularioCompetencia>(
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


    function manejarIconoSeleccionado(emoji: string) {
        setFormulario((formularioActual) => ({
            ...formularioActual,
            icono: emoji,
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

            const nombre = formulario.nombre.trim();
            const descripcion = formulario.descripcion.trim();
            const icono = formulario.icono.trim();

            if (!nombre) {
                throw new Error(
                    "Debes ingresar el nombre de la competencia."
                );
            }

            if (!descripcion) {
                throw new Error(
                    "Debes ingresar una descripción."
                );
            }

            if (!icono) {
                throw new Error(
                    "Debes elegir un ícono."
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

            const datosCompetencia: CompetenciaBlandaCreate = {
                nombre,
                descripcion,
                icono,
                orden,
                publicado: formulario.publicado,
            };

            const competenciaCreada =
                await crearCompetenciaBlanda(
                    datosCompetencia,
                    token
                );

            onCompetenciaCreada(competenciaCreada);
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
                    Nueva competencia
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Agregar competencia blanda
                </h2>

                <p className="mt-2 text-slate-600">
                    Ingresa una habilidad blanda que se mostrará en
                    tu portafolio.
                </p>
            </div>


            {error && (
                <div
                    role="alert"
                    className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4"
                >
                    <p className="font-semibold text-red-800">
                        No fue posible crear la competencia
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
                            onChange={manejarCampoTexto}
                            maxLength={80}
                            required
                            disabled={enviando}
                            placeholder="Ejemplo: Trabajo en Equipo"
                            className="rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-2 lg:w-48">
                        <label
                            htmlFor="icono"
                            className="font-semibold text-slate-800"
                        >
                            Ícono seleccionado
                        </label>

                        <input
                            id="icono"
                            name="icono"
                            type="text"
                            value={formulario.icono}
                            onChange={manejarCampoTexto}
                            maxLength={10}
                            required
                            readOnly
                            disabled={enviando}
                            placeholder="Elige abajo"
                            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-2xl outline-none disabled:bg-slate-100"
                        />
                    </div>
                </div>


                <SelectorEmojis
                    valorSeleccionado={formulario.icono}
                    onSeleccionar={manejarIconoSeleccionado}
                    disabled={enviando}
                />


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
                        maxLength={200}
                        required
                        disabled={enviando}
                        rows={3}
                        placeholder="Ejemplo: Colaboro con foco en objetivos comunes"
                        className="resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                    />
                </div>


                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex w-full flex-col gap-2 lg:w-48">
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
                            ? "Creando competencia..."
                            : "Agregar competencia"}
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