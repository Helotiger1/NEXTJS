import React from "react";
import { PaquetesCliente } from "./components/PaquetesCliente";
import DynamicHeader from "../components/DynamicHeader";
import { Paquetes } from "../../empleado/paquetes/components/Paquetes";

export default function page() {
    return (
        <>
            <PaquetesCliente></PaquetesCliente>
        </>
    );
}
