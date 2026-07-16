"use client";

import { obtenerCertificaciones } from "@/services/certificaciones";
import { useEffect, useState } from "react";
import type { Certificacion } from "@/types/Certificacion";



export default function CertificacionesAdminPage() {
  const [certificaciones, setCertificaciones] =
    useState<Certificacion[]>([]);

  const [error, setError] = useState<string | null>(null);

useEffect(() => {

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
    <>
    {error && <p>{error}</p>}
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
      </>
  );
}
