import React, { useState } from "react";

type EstadoEditableProps = {
  initial: string;
  onChange?: (nuevoEstado: string) => void;
};

export const EditState: React.FC<EstadoEditableProps> = ({
  initial,
  onChange,
}) => {
  const [editing, setEditing] = useState(false);
  const [estado, setEstado] = useState(initial);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevoEstado = e.target.value;
    setEstado(nuevoEstado);
    onChange?.(nuevoEstado);
    setEditing(false);
  };

  const opciones = ["EN TRANSITO", "EN ALMACEN"];

  return editing ? (
    <select
      value={estado}
      onChange={handleChange}
      onBlur={() => setEditing(false)}
      className="bg-white border rounded px-2 py-1"
    >
      {opciones.map((opcion) => (
        <option key={opcion} value={opcion}>
          {opcion}
        </option>
      ))}
    </select>
  ) : (
    <button
      onClick={() => {
        if (estado !== "EN ALMACEN") {
          setEditing(true);
        }
      }}
      className={`border rounded p-1 ${
        estado === "EN ALMACEN"
          ? "text-gray-500 cursor-not-allowed"
          : "text-blue-600 underline"
      }`}
    >
      {estado || "Ver detalles"}
    </button>
  );
};
