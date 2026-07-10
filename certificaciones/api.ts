const API_URL = "http://127.0.0.1:8000";

export async function obtenerCertificaciones() {
    const response = await fetch(`${API_URL}/certificaciones`);

    if (!response.ok) {
        throw new Error("Error");
    }

    return response.json();
}