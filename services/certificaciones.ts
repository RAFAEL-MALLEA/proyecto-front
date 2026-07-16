import type {
  Certificacion,
  CertificacionCreate,
} from "@/types/Certificacion";

const API_URL = "http://127.0.0.1:8000";

export async function obtenerCertificaciones(): Promise<
  Certificacion[]
> {
  const response = await fetch(
    `${API_URL}/certificaciones/`
  );

  if (!response.ok) {
    const detalle = await response.text();

    throw new Error(
      `Error ${response.status}: ${detalle}`
    );
  }

  return response.json();
}

export async function crearCertificacion(
  nuevaCertificacion: CertificacionCreate,
  token: string
): Promise<Certificacion> {
  if (!token) {
    throw new Error(
      "No se encontró el token de autenticación."
    );
  }

  const response = await fetch(
    `${API_URL}/certificaciones/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(nuevaCertificacion),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ??
        `No fue posible crear la certificación. Error ${response.status}`
    );
  }

  return data as Certificacion;
}