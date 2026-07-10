"use client";

import { useEffect, useState } from "react";
import { obtenerServicios } from "@/services/api";
import { Servicio } from "@/types/Servicio";
import { obtenerCertificaciones } from "@/certificaciones/api";

export default function Home() {

    const [servicios, setServicios] = useState<Servicio[]>([]);
     const [certificaciones, setCertificaciones] = useState<Certificacion[]>([]);

    useEffect(() => {

        obtenerServicios()
            .then((data) => setServicios(data))
            .catch(console.error);

         obtenerCertificaciones()
            .then((data) => setCertificaciones(data))
             .catch(console.error);

    });

return (
    <>
        <div>

            <h1>Servicios</h1>

            {servicios.map(servicio => (

                <div key={servicio.id}>
                    <h3>{servicio.Nombre_servicio}</h3>
                    <p>${servicio.valor}</p>
                </div>

            ))}

        </div>

        <div>

            <h1>Certificaciones</h1>

            {certificaciones.map(certificacion => (

                <div key={certificacion.id}>
                    <h3>{certificacion.nombre_certificacion}</h3>
                </div>

            ))}

        </div>
    </>
);
}