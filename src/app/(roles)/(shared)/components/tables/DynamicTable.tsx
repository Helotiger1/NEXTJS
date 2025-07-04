"use client"
import { useState } from "react";
import {DynamicTableProps} from "./types"


export default function DynamicTable<T extends object>({
  columns,
  data,
  rowsPerPage = 5,
}: DynamicTableProps<T>) {
  
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="space-y-4">
      <table className="min-w-full table-auto border-collapse border border-gray-300">

        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="border px-4 py-2 bg-gray-800 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.map((row, idx) => (
            <tr key={idx} className="even:bg-gray-800">
              {columns.map((col) => (
                <td key={String(col.key)} className="border px-4 py-2">
                  {col.render
                    ? col.render((row as any)[col.key], row)
                    : String((row as any)[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page + 1} de {totalPages}</span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="px-3 py-1 bg-gray-800 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      
    </div>
  );
}



