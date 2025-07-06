import React from "react";
import { PackageTable } from "./components/PackageTable";
import DynamicHeader from "../components/DynamicHeader";

export default function page() {
    return (
        <>
            <DynamicHeader h1Text="Tus paquetes"></DynamicHeader>
            <PackageTable></PackageTable>
        </>
    );
}
