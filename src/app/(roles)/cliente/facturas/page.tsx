import React from "react";
import { BillsTable } from "./components/BillsTable";
import DynamicHeader from "../components/DynamicHeader";

export default function page() {
    return (
        <>
            <DynamicHeader h1Text="Tus facturas"></DynamicHeader>
            <BillsTable></BillsTable>
        </>
    );
}
