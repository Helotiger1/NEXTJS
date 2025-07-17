"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Warehouse, Users } from 'lucide-react';

export default function AdminInicioPage() {
  return (
    <motion.main
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
    >
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        ¡Bienvenido a <span className="text-yellow-400">Administrador</span>!
      </h1>
      <p className="text-gray-300 text-lg mb-6">
        Panel de gestión del sistema
      </p>

      {/* Tarjetas informativas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        {/* Usuarios registrados */}
        <motion.div
          className="bg-gradient-to-br from-yellow-700 to-yellow-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold">23</h2>
              <p className="text-sm text-gray-300">Usuarios registrados</p>
            </div>
            <Users className="w-10 h-10 text-yellow-100" />
          </div>
        </motion.div>

        {/* Almacenes activos */}
        <motion.div
          className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.1 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-4xl font-bold">5</h2>
              <p className="text-sm text-gray-300">Almacenes activos</p>
            </div>
            <Warehouse className="w-10 h-10 text-gray-100" />
          </div>
        </motion.div>
      </section>

      {/* Accesos rápidos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          href="/admin/usuarios"
          className="bg-yellow-700 hover:bg-yellow-800 text-white text-center font-semibold py-8 px-4 rounded-2xl transition text-lg shadow-md"
        >
          Gestionar usuarios
        </Link>
        <Link
          href="/admin/almacen"
          className="bg-gray-800 hover:bg-gray-900 text-white text-center font-semibold py-8 px-4 rounded-2xl transition text-lg shadow-md"
        >
          Ver almacenes
        </Link>
      </section>
    </motion.main>
  );
}
