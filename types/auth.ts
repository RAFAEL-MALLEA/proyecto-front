export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UsuarioActual {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
}

export interface ObtenerUsuarioActual(
  token: string
  
)