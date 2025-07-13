import React from "react";
import DynamicHeader from "../components/DynamicHeader";
import { Facturas } from "./components/Facturas";

export default function page() {
    return (
        <>
            <DynamicHeader h1Text="Tus facturas"></DynamicHeader>
            <Facturas></Facturas>
        </>
    );
}
