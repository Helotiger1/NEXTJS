"use client";

import {
  TruckIcon,
  DocumentTextIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.main
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Bienvenida */}
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        ¡Hola, <span className="text-purple-400">{nombre}</span>!
      </h1>
      <p className="text-gray-300 text-lg mb-6">
        Aquí tienes un resumen de tus actividades recientes
      </p>

      {/* Tarjetas resumen */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PAQUETES */}
        <motion.div
          className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Mis paquetes</h2>
              <p className="text-sm text-gray-300">Gestión de tus paquetes</p>
            </div>
            <InboxArrowDownIcon className="w-10 h-10 text-purple-100" />
          </div>
          <ul className="text-sm space-y-1">
            <li>Total: {paquetes.total}</li>
            <li className="text-blue-200">En tránsito: {paquetes.transito}</li>
            <li className="text-yellow-200">Pendientes: {paquetes.pendientes}</li>
          </ul>
        </motion.div>

        {/* FACTURAS */}
        <motion.div
          className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Mis facturas</h2>
              <p className="text-sm text-gray-300">Resumen de tus pagos</p>
            </div>
            <DocumentTextIcon className="w-10 h-10 text-blue-100" />
          </div>
          <ul className="text-sm space-y-1">
            <li className="text-yellow-100">Pendientes: {facturas.pendientes}</li>
            <li className="text-green-200">Pagadas: {facturas.pagadas}</li>
          </ul>
        </motion.div>

        {/* ÚLTIMO ENVÍO */}
        <motion.div
          className="bg-gradient-to-br from-gray-800 to-black rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Último envío</h2>
              <p className="text-sm text-gray-300">Estado más reciente</p>
            </div>
            <TruckIcon className="w-10 h-10 text-gray-300" />
          </div>
          <ul className="text-sm space-y-1">
            <li>Código: {ultimoEnvio.codigo}</li>
            <li className="text-blue-300">Estado: {ultimoEnvio.estado}</li>
          </ul>
        </motion.div>
      </section>
    </motion.main>
  );
}