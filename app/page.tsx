"use client";

import { useEffect, useState } from "react";

import { obtenerServicios } from "@/services/api";
import { obtenerCertificaciones } from "@/certificaciones/api";

import type { Servicio } from "@/types/Servicio";
import type { Certificacion } from "@/types/Certificacion";

export default function Home() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [certificaciones, setCertificaciones] =
    useState<Certificacion[]>([]);

  useEffect(() => {
    obtenerServicios()
      .then(setServicios)
      .catch((error) => {
        console.error("Error cargando servicios:", error);
      });

    obtenerCertificaciones()
      .then(setCertificaciones)
      .catch((error) => {
        console.error("Error cargando certificaciones:", error);
      });
  }, []);

  return (
    <>
      <section>
        <h1>Servicios</h1>

        {servicios.map((servicio) => (
          <div key={servicio.id}>
            <h3>{servicio.Nombre_servicio}</h3>
            <p>${servicio.valor}</p>
          </div>
        ))}
      </section>

      <section>
        <h1>Certificaciones</h1>

        {certificaciones.map((certificacion) => (
          <div key={certificacion.id}>
            <h3>{certificacion.nombre_certificacion}</h3>
            <p>{certificacion.institucion}</p>
            <p>{certificacion.estado}</p>
          </div>
        ))}
      </section>
    </>
  );
}