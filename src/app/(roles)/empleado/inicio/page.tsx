'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Package,
  RefreshCcw,
  Truck,
  Users,
} from 'lucide-react';

export default function EmpleadoInicioPage() {
  return (
    <motion.main
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Bienvenida */}
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        ¡Bienvenido a <span className="text-purple-400">Empleado</span>!
      </h1>
      <p className="text-gray-300 text-lg mb-6">
        Panel de control de tus actividades diarias
      </p>

      {/* Tarjetas informativas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Paquetes registrados hoy */}
        <motion.div
          className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold">12</h2>
              <p className="text-sm text-gray-300">Paquetes registrados hoy</p>
            </div>
            <Package className="w-10 h-10 text-purple-100" />
          </div>
        </motion.div>

        {/* Cambios de estado */}
        <motion.div
          className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold">7</h2>
              <p className="text-sm text-gray-300">Cambios de estado</p>
            </div>
            <RefreshCcw className="w-10 h-10 text-blue-100" />
          </div>
        </motion.div>

        {/* Envíos asociados hoy */}
        <motion.div
          className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold">4</h2>
              <p className="text-sm text-gray-300">Envíos asociados hoy</p>
            </div>
            <Truck className="w-10 h-10 text-green-100" />
          </div>
        </motion.div>
      </section>

      {/* Accesos rápidos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/empleado/paquetes"
          className="bg-purple-700 hover:bg-purple-800 text-white text-center font-semibold py-8 px-4 rounded-2xl transition text-lg shadow-md"
        >
          Registrar paquete
        </Link>
        <Link
          href="/empleado/envios"
          className="bg-blue-700 hover:bg-blue-800 text-white text-center font-semibold py-8 px-4 rounded-2xl transition text-lg shadow-md"
        >
          Asociar envío
        </Link>
        <Link
          href="/empleado/estado"
          className="bg-yellow-700 hover:bg-yellow-800 text-white text-center font-semibold py-8 px-4 rounded-2xl transition text-lg shadow-md"
        >
          Cambiar estado
        </Link>
        <Link
          href="/empleado/clientes"
          className="bg-gray-800 hover:bg-gray-900 text-white text-center font-semibold py-8 px-4 rounded-2xl transition text-lg shadow-md"
        >
          Ver clientes
        </Link>
      </section>
    </motion.main>
  );
}