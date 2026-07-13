import type {
  LoginRequest,
  TokenResponse,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function iniciarSesion(
  credenciales: LoginRequest
): Promise<TokenResponse> {
  if (!API_URL) {
    throw new Error(
      "La variable NEXT_PUBLIC_API_URL no está configurada."
    );
  }

  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(credenciales),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ?? "No fue posible iniciar sesión."
    );
  }

  return data as TokenResponse;
}