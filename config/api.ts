const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error(
    "Falta configurar NEXT_PUBLIC_API_URL en el archivo .env.local"
  );
}

export const API_BASE_URL = apiUrl.replace(/\/$/, "");