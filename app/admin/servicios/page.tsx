"use client";

import type { Servicio } from "@/types/Servicio";
import { obtenerServicios } from "@/services/servicios";
import { useEffect, useState } from "react";

export default function ServiciosAdminPage() {
  const [servicios, setServicios] = useState<Servicio[]>([]);


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

}, []);



  return (
    <>
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
      </>
  );
}