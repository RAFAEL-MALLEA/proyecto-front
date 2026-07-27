import { API_BASE_URL } from "@/config/api";
import type {
  Proyecto,
  ProyectoCreate,
  ProyectoUpdate,
} from "@/types/Proyecto";


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

  return texto || "No fue posible completar la solicitud.";
}


async function procesarRespuesta<T>(
  response: Response,
  mensajePredeterminado: string
): Promise<T> {
  if (!response.ok) {
    const detalle = await obtenerDetalleError(response);

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

  const token = sessionStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "No existe una sesión activa. Inicia sesión nuevamente."
    );
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}


export async function obtenerProyectosPublicados(
  destacado?: boolean
): Promise<Proyecto[]> {
  const parametros = new URLSearchParams();

  if (destacado !== undefined) {
    parametros.set("destacado", String(destacado));
  }

  const consulta = parametros.toString();

  const url =
    `${API_BASE_URL}/proyectos/` +
    (consulta ? `?${consulta}` : "");

  const response = await fetch(url, {
    cache: "no-store",
  });

  return procesarRespuesta<Proyecto[]>(
    response,
    "No fue posible obtener los proyectos."
  );
}


export async function obtenerProyectoPublicado(
  proyectoId: number
): Promise<Proyecto> {
  const response = await fetch(
    `${API_BASE_URL}/proyectos/${proyectoId}`,
    {
      cache: "no-store",
    }
  );

  return procesarRespuesta<Proyecto>(
    response,
    "No fue posible obtener el proyecto."
  );
}


export async function obtenerTodosLosProyectos(): Promise<
  Proyecto[]
> {
  const response = await fetch(
    `${API_BASE_URL}/proyectos/todos`,
    {
      headers: obtenerEncabezadosAutenticacion(),
      cache: "no-store",
    }
  );

  return procesarRespuesta<Proyecto[]>(
    response,
    "No fue posible obtener los proyectos del administrador."
  );
}


export async function crearProyecto(
  datosProyecto: ProyectoCreate
): Promise<Proyecto> {
  const response = await fetch(
    `${API_BASE_URL}/proyectos/`,
    {
      method: "POST",
      headers: obtenerEncabezadosAutenticacion(),
      body: JSON.stringify(datosProyecto),
    }
  );

  return procesarRespuesta<Proyecto>(
    response,
    "No fue posible crear el proyecto."
  );
}


export async function actualizarProyecto(
  proyectoId: number,
  datosProyecto: ProyectoUpdate
): Promise<Proyecto> {
  const response = await fetch(
    `${API_BASE_URL}/proyectos/${proyectoId}`,
    {
      method: "PATCH",
      headers: obtenerEncabezadosAutenticacion(),
      body: JSON.stringify(datosProyecto),
    }
  );

  return procesarRespuesta<Proyecto>(
    response,
    "No fue posible actualizar el proyecto."
  );
}


export async function eliminarProyecto(
  proyectoId: number
): Promise<Proyecto> {
  const response = await fetch(
    `${API_BASE_URL}/proyectos/${proyectoId}`,
    {
      method: "DELETE",
      headers: obtenerEncabezadosAutenticacion(),
    }
  );

  return procesarRespuesta<Proyecto>(
    response,
    "No fue posible eliminar el proyecto."
  );
}