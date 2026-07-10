const API_URL = "http://127.0.0.1:8000";

export async function obtenerCertificaciones() {
  const response = await fetch(`${API_URL}/certificaciones/`);

  if (!response.ok) {
    const detalle = await response.text();

    throw new Error(
      `Error ${response.status} al obtener certificaciones: ${detalle}`,
    );
  }

  return response.json();
}