import React from "react";
import { PaquetesCliente } from "./components/PaquetesCliente";
import DynamicHeader from "../components/DynamicHeader";
import { Paquetes } from "../../empleado/paquetes/components/Paquetes";

export default function page() {
    return (
        <>
            <DynamicHeader h1Text="Tus paquetes"></DynamicHeader>
            <PaquetesCliente></PaquetesCliente>
        </>
    );
}
