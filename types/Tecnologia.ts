export interface Tecnologia {
  id: number;
  nombre: string;
  categoria: string;
  nivel: number;
  descripcion: string | null;
  icono: string | null;
  color: string | null;
  orden: number;
  publicado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface TecnologiaCreate {
  nombre: string;
  categoria: string;
  nivel?: number;
  descripcion?: string | null;
  icono?: string | null;
  color?: string | null;
  orden?: number;
  publicado?: boolean;
}

export type TecnologiaUpdate =
  Partial<TecnologiaCreate>;