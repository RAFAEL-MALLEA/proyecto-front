import { API_BASE_URL } from "@/config/api";
import type {
  Tecnologia,
  TecnologiaCreate,
  TecnologiaUpdate,
} from "@/types/Tecnologia";


async function obtenerDetalleError(
  response: Response
): Promise<string> {
  const tipoContenido =
    response.headers.get("content-type") ?? "";

  if (tipoContenido.includes("application/json")) {
    const datos: unknown = await response.json();

    if (
      typeof datos === "object" &&
      datos !== null &&
      "detail" in datos
    ) {
      const detalle = (
        datos as { detail?: unknown }
      ).detail;

      if (typeof detalle === "string") {
        return detalle;
      }

      if (detalle !== undefined) {
        return JSON.stringify(detalle);
      }
    }

    return JSON.stringify(datos);
  }

  const texto = await response.text();

  return (
    texto ||
    "No fue posible completar la solicitud."
  );
}


async function procesarRespuesta<T>(
  response: Response,
  mensajePredeterminado: string
): Promise<T> {
  if (!response.ok) {
    const detalle =
      await obtenerDetalleError(response);

    throw new Error(
      `${mensajePredeterminado} ` +
        `(${response.status}): ${detalle}`
    );
  }

  return response.json() as Promise<T>;
}


function obtenerEncabezadosAutenticacion(): HeadersInit {
  if (typeof window === "undefined") {
    throw new Error(
      "La autenticación debe ejecutarse desde el navegador."
    );
  }

  const token =
    sessionStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "No existe una sesión activa. " +
        "Inicia sesión nuevamente."
    );
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


export async function obtenerTecnologiasPublicadas(
  categoria?: string
): Promise<Tecnologia[]> {
  const parametros = new URLSearchParams();

  const categoriaLimpia = categoria?.trim();

  if (categoriaLimpia) {
    parametros.set(
      "categoria",
      categoriaLimpia
    );
  }

  const consulta = parametros.toString();

  const url =
    `${API_BASE_URL}/tecnologias/` +
    (consulta ? `?${consulta}` : "");

  const response = await fetch(url, {
    cache: "no-store",
  });

  return procesarRespuesta<Tecnologia[]>(
    response,
    "No fue posible obtener las tecnologías."
  );
}


export async function obtenerTecnologiaPublicada(
  tecnologiaId: number
): Promise<Tecnologia> {
  const response = await fetch(
    `${API_BASE_URL}/tecnologias/${tecnologiaId}`,
    {
      cache: "no-store",
    }
  );

  return procesarRespuesta<Tecnologia>(
    response,
    "No fue posible obtener la tecnología."
  );
}


export async function obtenerTodasLasTecnologias(): Promise<
  Tecnologia[]
> {
  const response = await fetch(
    `${API_BASE_URL}/tecnologias/todas`,
    {
      headers:
        obtenerEncabezadosAutenticacion(),
      cache: "no-store",
    }
  );

  return procesarRespuesta<Tecnologia[]>(
    response,
    "No fue posible obtener las tecnologías del administrador."
  );
}


export async function crearTecnologia(
  datosTecnologia: TecnologiaCreate
): Promise<Tecnologia> {
  const response = await fetch(
    `${API_BASE_URL}/tecnologias/`,
    {
      method: "POST",
      headers:
        obtenerEncabezadosAutenticacion(),
      body: JSON.stringify(datosTecnologia),
    }
  );

  return procesarRespuesta<Tecnologia>(
    response,
    "No fue posible crear la tecnología."
  );
}


export async function actualizarTecnologia(
  tecnologiaId: number,
  datosTecnologia: TecnologiaUpdate
): Promise<Tecnologia> {
  const response = await fetch(
    `${API_BASE_URL}/tecnologias/${tecnologiaId}`,
    {
      method: "PATCH",
      headers:
        obtenerEncabezadosAutenticacion(),
      body: JSON.stringify(datosTecnologia),
    }
  );

  return procesarRespuesta<Tecnologia>(
    response,
    "No fue posible actualizar la tecnología."
  );
}


export async function eliminarTecnologia(
  tecnologiaId: number
): Promise<Tecnologia> {
  const response = await fetch(
    `${API_BASE_URL}/tecnologias/${tecnologiaId}`,
    {
      method: "DELETE",
      headers:
        obtenerEncabezadosAutenticacion(),
    }
  );

  return procesarRespuesta<Tecnologia>(
    response,
    "No fue posible eliminar la tecnología."
  );
}