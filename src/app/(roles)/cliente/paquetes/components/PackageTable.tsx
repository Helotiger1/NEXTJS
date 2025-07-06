"use client"
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { data, columns } from "../configs";

export const PackageTable = () => {

    return <DynamicTable data={data} columns={columns} rowsPerPage={4}></DynamicTable>

};
