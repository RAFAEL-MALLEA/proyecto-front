import { API_BASE_URL } from "@/config/api";
import type {
    Experiencia,
    ExperienciaCreate,
    ExperienciaUpdate,
} from "@/types/Experiencia";

export async function obtenerExperiencias(): Promise<
    Experiencia[]
> {
    const response = await fetch(
        `${API_BASE_URL}/experiencia/`
    );

    if (!response.ok) {
        const detalle = await response.text();

        throw new Error(
            `Error ${response.status}: ${detalle}`
        );
    }

    return response.json();
}

export async function obtenerTodasLasExperiencias(
    token: string
): Promise<Experiencia[]> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/experiencia/todas`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const detalle = await response.text();

        throw new Error(
            `Error ${response.status}: ${detalle}`
        );
    }

    return response.json();
}

export async function crearExperiencia(
    nuevaExperiencia: ExperienciaCreate,
    token: string
): Promise<Experiencia> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/experiencia/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaExperiencia),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ??
            `No fue posible crear la experiencia. Error ${response.status}`
        );
    }

    return data as Experiencia;
}

export async function actualizarExperiencia(
    experienciaId: number,
    datosActualizados: ExperienciaUpdate,
    token: string
): Promise<Experiencia> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    if (
        !Number.isInteger(experienciaId) ||
        experienciaId <= 0
    ) {
        throw new Error(
            "El ID de la experiencia no es válido."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/experiencia/${experienciaId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(datosActualizados),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ??
            `No fue posible actualizar la experiencia. Error ${response.status}`
        );
    }

    return data as Experiencia;
}

export async function eliminarExperiencia(
    experienciaId: number,
    token: string
): Promise<Experiencia> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    if (
        !Number.isInteger(experienciaId) ||
        experienciaId <= 0
    ) {
        throw new Error(
            "El ID de la experiencia no es válido."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/experiencia/${experienciaId}`,
        {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ??
            `No fue posible eliminar la experiencia. Error ${response.status}`
        );
    }

    return data as Experiencia;
}