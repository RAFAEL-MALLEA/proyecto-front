import type {
  Servicio,
  ServicioCreate,
  ServicioUpdate,
} from "@/types/Servicio";

const API_URL = "http://127.0.0.1:8000";

export async function obtenerServicios(): Promise<Servicio[]> {
  const response = await fetch(`${API_URL}/servicios/`);

  if (!response.ok) {
    const detalle = await response.text();

    throw new Error(
      `Error ${response.status}: ${detalle}`
    );
  }

  return response.json();
}

export async function crearServicio(
  nuevoServicio: ServicioCreate,
  token: string
): Promise<Servicio> {
  if (!token) {
    throw new Error(
      "No se encontró el token de autenticación."
    );
  }

  const response = await fetch(`${API_URL}/servicios/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nuevoServicio),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ??
        `No fue posible crear el servicio. Error ${response.status}`
    );
  }

  return data as Servicio;
}

export async function actualizarServicio(
  servicioId: number,
  datosActualizados: ServicioUpdate,
  token: string
): Promise<Servicio> {
  if (!token) {
    throw new Error(
      "No se encontró el token de autenticación."
    );
  }

  if (!Number.isInteger(servicioId) || servicioId <= 0) {
    throw new Error(
      "El ID del servicio no es válido."
    );
  }

  const response = await fetch(
    `${API_URL}/servicios/?servicio_id=${servicioId}`,
    {
      method: "PUT",
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
        `No fue posible actualizar el servicio. Error ${response.status}`
    );
  }

  return data as Servicio;
}

export async function eliminarServicio(
  servicioId: number,
  token: string
): Promise<Servicio> {
  if (!token) {
    throw new Error(
      "No se encontró el token de autenticación."
    );
  }

  if (!Number.isInteger(servicioId) || servicioId <= 0) {
    throw new Error(
      "El ID del servicio no es válido."
    );
  }

  const response = await fetch(
    `${API_URL}/servicios/?servicio_id=${servicioId}`,
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
        `No fue posible eliminar el servicio. Error ${response.status}`
    );
  }

  return data as Servicio;
}