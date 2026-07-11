export interface Certificacion {
  id: number;
  nombre_certificacion: string;
  descripcion: string | null;
  institucion: string | null;
  fecha_obtencion: string;
  imagen: string | null;
  estado: "Terminado" | "Completado";
}