"use client";
import DynamicTable from "@/app/(roles)/(shared)/components/tables/DynamicTable";
import React from "react";
import { data, columns } from "../configs";

export const ClientesTable = () => {
  return <DynamicTable data={data} columns={columns} rowsPerPage={2} />;
};
