export interface Experiencia {
    id: number;
    empresa: string;
    cargo: string;
    descripcion: string;
    ubicacion: string | null;
    tecnologias: string | null;
    logo: string | null;
    url_empresa: string | null;
    fecha_inicio: string;
    fecha_fin: string | null;
    trabajo_actual: boolean;
    orden: number;
    publicado: boolean;
}

export interface ExperienciaCreate {
    empresa: string;
    cargo: string;
    descripcion: string;
    ubicacion: string | null;
    tecnologias: string | null;
    logo: string | null;
    url_empresa: string | null;
    fecha_inicio: string;
    fecha_fin: string | null;
    trabajo_actual: boolean;
    orden: number;
    publicado: boolean;
}

export interface ExperienciaUpdate {
    empresa?: string;
    cargo?: string;
    descripcion?: string;
    ubicacion?: string | null;
    tecnologias?: string | null;
    logo?: string | null;
    url_empresa?: string | null;
    fecha_inicio?: string;
    fecha_fin?: string | null;
    trabajo_actual?: boolean;
    orden?: number;
    publicado?: boolean;
}