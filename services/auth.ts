import { API_BASE_URL } from "@/config/api";

import type {
  LoginRequest,
  TokenResponse,
  UsuarioActual,
} from "@/types/auth";

export async function iniciarSesion(
  datos: LoginRequest
): Promise<TokenResponse> {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(datos),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ??
        `No fue posible iniciar sesión. Error ${response.status}`
    );
  }

  return data as TokenResponse;
}

export async function obtenerUsuarioActual(
  token: string
): Promise<UsuarioActual> {
  if (!token) {
    throw new Error(
      "No se encontró el token de autenticación."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail ??
        `No fue posible validar la sesión. Error ${response.status}`
    );
  }

  return data as UsuarioActual;
}