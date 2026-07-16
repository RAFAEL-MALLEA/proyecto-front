export interface Servicio {
  id: number;
  Nombre_servicio: string;
  valor: number;
}

export interface ServicioCreate {
  Nombre_servicio: string;
  valor: number;
}

export interface ServicioUpdate {
  Nombre_servicio: string;
  valor: number;
}