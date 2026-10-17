export interface CompetenciaBlanda {
    id: number;
    nombre: string;
    descripcion: string;
    icono: string;
    orden: number;
    publicado: boolean;
}

export interface CompetenciaBlandaCreate {
    nombre: string;
    descripcion: string;
    icono: string;
    orden: number;
    publicado: boolean;
}

export interface CompetenciaBlandaUpdate {
    nombre?: string;
    descripcion?: string;
    icono?: string;
    orden?: number;
    publicado?: boolean;
}