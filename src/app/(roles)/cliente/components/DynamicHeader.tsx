import React, { ReactNode } from "react";
import { GenericButton } from "../../(shared)/components/buttons/GenericButton";

export default function DynamicHeader({
  h1Text,
  children,
  onChange,
  onChangeFilter,
  columns,
  filtro,
}: {
  h1Text: string;
  children: ReactNode;
  onChange: (e: any) => void;
  onChangeFilter: (e: any) => void;
  columns: any;
  filtro: any;
}) {
  const columnasVisibles = columns.filter((col : any) => !col.render);

  return (
    <header>
      <div className="space-y-6 mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">{h1Text}{children}</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            onChange={onChange}
            type="text"
            placeholder="🔍 Buscar"
            className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm transition-all text-gray-700"
          />

          <select
            value={filtro}
            onChange={onChangeFilter}
            className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm transition-all text-gray-700"
          >
            {columnasVisibles.length === 0 ? (
              <option value="">No hay opciones</option>
            ) : (
              columnasVisibles.map((col: any) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))
            )}
          </select>

        </div>
      </div>
    </header>
  );
}
