import { API_BASE_URL } from "@/config/api";
import type {
    CompetenciaBlanda,
    CompetenciaBlandaCreate,
    CompetenciaBlandaUpdate,
} from "@/types/CompetenciaBlanda";

export async function obtenerCompetenciasBlandas(): Promise<
    CompetenciaBlanda[]
> {
    const response = await fetch(
        `${API_BASE_URL}/competencias-blandas/`
    );

    if (!response.ok) {
        const detalle = await response.text();

        throw new Error(
            `Error ${response.status}: ${detalle}`
        );
    }

    return response.json();
}

export async function obtenerTodasLasCompetenciasBlandas(
    token: string
): Promise<CompetenciaBlanda[]> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/competencias-blandas/todas`,
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

export async function crearCompetenciaBlanda(
    nuevaCompetencia: CompetenciaBlandaCreate,
    token: string
): Promise<CompetenciaBlanda> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/competencias-blandas/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaCompetencia),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.detail ??
            `No fue posible crear la competencia. Error ${response.status}`
        );
    }

    return data as CompetenciaBlanda;
}

export async function actualizarCompetenciaBlanda(
    competenciaId: number,
    datosActualizados: CompetenciaBlandaUpdate,
    token: string
): Promise<CompetenciaBlanda> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    if (
        !Number.isInteger(competenciaId) ||
        competenciaId <= 0
    ) {
        throw new Error(
            "El ID de la competencia no es válido."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/competencias-blandas/${competenciaId}`,
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
            `No fue posible actualizar la competencia. Error ${response.status}`
        );
    }

    return data as CompetenciaBlanda;
}

export async function eliminarCompetenciaBlanda(
    competenciaId: number,
    token: string
): Promise<CompetenciaBlanda> {
    if (!token) {
        throw new Error(
            "No se encontró el token de autenticación."
        );
    }

    if (
        !Number.isInteger(competenciaId) ||
        competenciaId <= 0
    ) {
        throw new Error(
            "El ID de la competencia no es válido."
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/competencias-blandas/${competenciaId}`,
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
            `No fue posible eliminar la competencia. Error ${response.status}`
        );
    }

    return data as CompetenciaBlanda;
}