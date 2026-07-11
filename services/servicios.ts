const API_URL = "http://127.0.0.1:8000";

export async function obtenerServicios() {
  const response = await fetch(`${API_URL}/servicios/`);

  if (!response.ok) {
    const detalle = await response.text();
    throw new Error(`Error ${response.status}: ${detalle}`);
  }

  return response.json();
}