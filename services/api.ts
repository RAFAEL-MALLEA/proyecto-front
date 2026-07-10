import { API_URL } from "./api";

export async function obtenerServicios() {
    const response = await fetch(`${API_URL}/servicios`);

    console.log("Status:", response.status);

    if (!response.ok) {
        const error = await response.text();
        console.log("Error del backend:", error);

        throw new Error(`Error ${response.status}`);
    }

    return response.json();
}