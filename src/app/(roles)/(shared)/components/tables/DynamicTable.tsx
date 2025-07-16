"use client";
import { useState } from "react";
import { DynamicTableProps } from "./types";

import { motion } from "framer-motion";
import DynamicHeader from "@/app/(roles)/cliente/components/DynamicHeader";

export default function DynamicTable<T extends object>({
    name,
    columns,
    data,
    rowsPerPage = 5,
    children,
    idName = "codigo",
}: DynamicTableProps<T>) {
    const [filtro, setFiltro] = useState(columns[0].key);
    const [busqueda, setBusqueda] = useState('');

    const [page, setPage] = useState(0);

    const filteredData = busqueda
        ? data.filter((row) =>
              String((row as any)[filtro])
                  .toLowerCase()
                  .includes(busqueda.toLowerCase())
          )
        : data;

    const totalPages = Math.ceil(filteredData.length / rowsPerPage);

    const paginatedData = filteredData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangeFilter = (e : any) => {
        setFiltro(e.target.value);
    };

    const handleChange = (e: any) => {
        setBusqueda(e.target.value);
    };

    return (
        <motion.div
            className="p-6 bg-white rounded-2xl shadow-xl mt-6 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}>
            {name && (
                <DynamicHeader
                    filtro={filtro}
                    onChangeFilter={handleChangeFilter}
                    columns={columns}
                    onChange={handleChange}
                    h1Text={name}>
                    {children}
                </DynamicHeader>
            )}
            <div className="overflow-auto max-w-full">
            <table className="min-w-full text-sm text-gray-700 table-fixed overflow-hidden border border-gray-200 rounded-lg">
                <thead className="bg-gradient-to-r from-purple-800 to-purple-600 text-white uppercase tracking-wide text-sm">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={String(col.key)}
                                className="px-4 py-3 text-left">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="bg-white">
                    {paginatedData.map((row, idx) => (
                        <tr
                            key={idx}
                            className="border-b hover:bg-gray-50 transition-all">
                            {columns.map((col) => (
                                <td
                                    key={String(col.key)}
                                    className="px-4 py-3 text-left truncate">
                                    {col.render
                                        ? col.render((row as any)[col.key], row)
                                        : String((row as any)[col.key] ?? "")}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {data.length > rowsPerPage && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 0))}
                        disabled={page === 0}
                        className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                        ◀ Anterior
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setPage(i)}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${
                                page === i
                                    ? "bg-purple-700 text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                            }`}>
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() =>
                            setPage((p) => Math.min(p + 1, totalPages - 1))
                        }
                        disabled={page >= totalPages - 1}
                        className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
                        Siguiente ▶
                    </button>
                </div>
                
            )}
            </div>
        </motion.div>
    );
}
