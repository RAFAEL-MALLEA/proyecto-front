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

  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  obtenerServicios()
    .then((data) => {
      console.log("Servicios recibidos:", data);
      setServicios(data);
    })
    .catch((error) => {
      console.error("Error servicios:", error);
    });

  obtenerCertificaciones()
    .then((data) => {
      console.log("Certificaciones recibidas:", data);
      setCertificaciones(data);
    })
    .catch((error) => {
      console.error("Error certificaciones:", error);
    });
}, []);

  return (
    <main>
      {error && <p>{error}</p>}

      <section>
        <h1>Servicios</h1>

        {servicios.length === 0 ? (
          <p>No existen servicios registrados.</p>
        ) : (
          servicios.map((servicio) => (
            <div key={servicio.id}>
              <h3>{servicio.Nombre_servicio}</h3>
              <p>${Number(servicio.valor).toLocaleString("es-CL")}</p>
            </div>
          ))
        )}
      </section>

      <section>
        <h1>Certificaciones</h1>

        {certificaciones.length === 0 ? (
          <p>No existen certificaciones registradas.</p>
        ) : (
          certificaciones.map((certificacion) => (
            <article key={certificacion.id}>
              <h3>{certificacion.nombre_certificacion}</h3>

              <p>
                Institución:{" "}
                {certificacion.institucion ?? "No especificada"}
              </p>

              <p>{certificacion.descripcion}</p>

              <p>Fecha: {certificacion.fecha_obtencion}</p>

              <p>
                Estado:{" "}
                {certificacion.estado === "Completado"
                  ? "Completado"
                  : "Terminado"}
              </p>
            </article>
          ))
        )}
      </section>
    <section>
      
    </section>
    </main>

  );
}