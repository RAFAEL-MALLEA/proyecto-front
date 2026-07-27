export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  tecnologias: string;
  imagen: string | null;
  url_repositorio: string | null;
  url_demo: string | null;
  destacado: boolean;
  publicado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface ProyectoCreate {
  titulo: string;
  descripcion: string;
  tecnologias: string;
  imagen?: string | null;
  url_repositorio?: string | null;
  url_demo?: string | null;
  destacado?: boolean;
  publicado?: boolean;
}

export type ProyectoUpdate = Partial<ProyectoCreate>;