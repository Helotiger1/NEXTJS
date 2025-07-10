"use client";

import { useState } from "react";

export default function ClienteDashboard() {
  const [nombre, setNombre] = useState("Juan Pérez");

  const paquetes = {
    total: 6,
    transito: 3,
    pendientes: 1,
  };

  const facturas = {
    pendientes: 2,
    pagadas: 4,
  };

  const ultimoEnvio = {
    codigo: "ENV123456",
    estado: "En tránsito",
  };

  return (
    <main className="p-6 space-y-6 max-w-7xl mx-auto text-white">
      <h1 className="text-3xl font-bold">¡Hola, {nombre}!</h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta de Paquetes */}
        <div className="bg-white text-black p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Paquetes</h2>
          <div className="space-y-1 text-sm">
            <p>Total: {paquetes.total}</p>
            <p className="text-blue-800">En tránsito: {paquetes.transito}</p>
            <p className="text-yellow-800">Pendientes: {paquetes.pendientes}</p>
          </div>
        </div>

        {/* Tarjeta de Facturas */}
        <div className="bg-white text-black p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Facturas</h2>
          <div className="space-y-1 text-sm">
            <p className="text-yellow-800">Pendientes: {facturas.pendientes}</p>
            <p className="text-green-800">Pagadas: {facturas.pagadas}</p>
          </div>
        </div>

        {/* Tarjeta Último Envío */}
        <div className="bg-white text-black p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Último Envío</h2>
          <div className="space-y-1 text-sm">
            <p>Código: {ultimoEnvio.codigo}</p>
            <p className="text-blue-800">Estado: {ultimoEnvio.estado}</p>
          </div>
        </div>
      </section>
    </main>
  );
}