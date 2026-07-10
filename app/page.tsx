"use client";

import { useEffect, useState } from "react";
import { obtenerServicios } from "@/services/api";
import { Servicio } from "@/types/Servicio";

export default function Home() {

    const [servicios, setServicios] = useState<Servicio[]>([]);

    useEffect(() => {

        obtenerServicios()
            .then((data) => setServicios(data))
            .catch(console.error);

    }, []);

    return (
        <div>

            <h1>Servicios</h1>

            {
                servicios.map(servicio => (

                    <div key={servicio.id}>

                        <h3>{servicio.Nombre_servicio}</h3>

                        <p>${servicio.valor}</p>

                    </div>

                ))
            }

        </div>
    );
}