"use client"
import { useState } from "react";

type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
};

type DynamicTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  rowsPerPage?: number;
};

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



const data = [
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },

];

const columns = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Correo" },
  {
    key: "acciones",
    label: "Acciones",
    render: (_: any, row: any) => (
      <button
        onClick={() => alert(`Detalles de ${row.name}`)}
        className="text-blue-600 underline"
      >
        Ver detalles
      </button>
    )
  }
];

export function App() {
  return <DynamicTable columns={columns} data={data} rowsPerPage={9} />;
}