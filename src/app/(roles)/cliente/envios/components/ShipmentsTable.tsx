'use client';

import { useState } from 'react';


import { motion } from 'framer-motion';


export const fakeShipments = [
  {
    id: 'TRK-001',
    descripcion: 'Documentos legales importantes',
    tipo: 'Sobre',
    origen: 'Caracas',
    destino: 'Maracaibo',
    estado: 'En tránsito',
    peso: '0.5 kg',
    alto: '2 cm',
    ancho: '30 cm',
    fecha: '2025-07-10',
    oficina: 'Oficina Central Caracas',
  },
  {
    id: 'TRK-002',
    descripcion: 'Electrodoméstico mediano',
    tipo: 'Caja',
    origen: 'Valencia',
    destino: 'Barquisimeto',
    estado: 'Pendiente',
    peso: '5 kg',
    alto: '40 cm',
    ancho: '35 cm',
    fecha: '2025-07-11',
    oficina: 'Sucursal Valencia Norte',
  },
  {
    id: 'TRK-003',
    descripcion: 'Libros escolares para primaria',
    tipo: 'Caja',
    origen: 'Mérida',
    destino: 'San Cristóbal',
    estado: 'Llegado',
    peso: '3 kg',
    alto: '25 cm',
    ancho: '30 cm',
    fecha: '2025-07-12',
    oficina: 'Centro de Distribución Mérida',
  }]

const ITEMS_PER_PAGE = 5;

export default function ShipmentsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');

  const filteredShipments = fakeShipments.filter((item) => {
    const matchesSearch = item.id.toLowerCase().includes(search.toLowerCase());
    const matchesEstado = estadoFilter ? item.estado === estadoFilter : true;
    return matchesSearch && matchesEstado;
  });

  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    if (page >= 1 && page <= Math.ceil(filteredShipments.length / ITEMS_PER_PAGE)) {
      setCurrentPage(page);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setEstadoFilter('');
    setCurrentPage(1);
  };

  return (
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-xl mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        Historial de Envíos
      </h2>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Buscar por tracking..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm transition-all text-gray-700"
        />

        <select
          value={estadoFilter}
          onChange={(e) => setEstadoFilter(e.target.value)}
          className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm transition-all text-gray-700"
        >
          <option value="">🎯 Todos los estados</option>
          <option value="En tránsito">🚚 En tránsito</option>
          <option value="Llegado">📦 Llegado</option>
          <option value="Pendiente">⏳ Pendiente</option>
        </select>

        <button
          onClick={resetFilters}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all text-sm shadow-sm w-full md:w-auto"
        >
          Limpiar filtros
        </button>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-gray-700 table-fixed">
          <thead className="bg-gradient-to-r from-purple-800 to-purple-600 text-white uppercase tracking-wide text-sm">
            <tr>
              <th className="py-3 px-4 text-left w-[120px]">Tracking</th>
              <th className="px-4 text-left w-[150px]">Descripción</th>
              <th className="px-4 text-center w-[100px]">Tipo</th>
              <th className="px-4 text-left w-[120px]">Origen</th>
              <th className="px-4 text-left w-[120px]">Destino</th>
              <th className="px-4 text-left w-[140px]">Estado</th>
              <th className="px-4 text-right w-[80px]">Peso</th>
              <th className="px-4 text-right w-[80px]">Alto</th>
              <th className="px-4 text-right w-[80px]">Ancho</th>
              <th className="px-4 text-center w-[120px]">Fecha</th>
              <th className="px-4 text-left w-[140px]">Oficina</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {paginatedShipments.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition-all"
              >
                {/* Tracking */}
                <td className="py-3 px-4 text-left font-medium whitespace-nowrap">
                  {item.id}
                </td>

                {/* Descripción truncada con tooltip */}
                <td
                  className="px-4 text-left truncate max-w-[150px]"
                  title={item.descripcion}
                >
                  {item.descripcion}
                </td>

                {/* Tipo */}
                <td className="px-4 text-center">{item.tipo}</td>

                {/* Origen */}
                <td
                  className="px-4 text-left truncate max-w-[120px]"
                  title={item.origen}
                >
                  {item.origen}
                </td>

                {/* Destino */}
                <td
                  className="px-4 text-left truncate max-w-[120px]"
                  title={item.destino}
                >
                  {item.destino}
                </td>

                {/* Estado */}
                <td className="px-4 text-left w-[140px]">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap
                      ${
                        item.estado === 'Llegado'
                          ? 'bg-green-100 text-green-700'
                          : item.estado === 'En tránsito'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                  >
                    {item.estado}
                  </span>
                </td>

                {/* Medidas */}
                <td className="px-4 text-right">{item.peso}</td>
                <td className="px-4 text-right">{item.alto}</td>
                <td className="px-4 text-right">{item.ancho}</td>

                {/* Fecha */}
                <td className="px-4 text-center">{item.fecha}</td>

                {/* Oficina */}
                <td
                  className="px-4 text-left truncate max-w-[140px]"
                  title={item.oficina}
                >
                  {item.oficina}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {filteredShipments.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ◀ Anterior
          </button>

          {Array.from(
            { length: Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) },
            (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 text-sm rounded-md transition-all ${
                  currentPage === i + 1
                    ? 'bg-purple-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {i + 1}
              </button>
            )
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredShipments.length / ITEMS_PER_PAGE)}
            className="px-3 py-1 text-sm rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente ▶
          </button>
        </div>
      )}
    </motion.div>
  );
}