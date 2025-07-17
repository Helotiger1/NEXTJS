'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Truck, Package, FileText } from 'lucide-react';

export default function ClienteDashboard() {
  const [nombre, setNombre] = useState('');

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
    codigo: 'ENV123456',
    estado: 'En tránsito',
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.nombre) {
      setNombre(user.nombre);

      const alreadyWelcomed = sessionStorage.getItem('bienvenida-mostrada');
      if (!alreadyWelcomed) {
        toast.success(`Bienvenido, ${user.nombre}`);
        sessionStorage.setItem('bienvenida-mostrada', 'true');
      }
    }
  }, []);

  return (
    <motion.div
      className="flex flex-col h-full bg-black text-white"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Encabezado */}
      <h1 className="text-4xl font-bold tracking-tight mb-2">
        ¡Hola, <span className="text-purple-400">{nombre}</span>!
      </h1>
      <p className="text-gray-300 text-lg mb-6">
        Aquí tienes un resumen de tus actividades recientes
      </p>

      {/* Tarjetas resumen */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Paquetes */}
        <motion.div
          className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Mis paquetes</h2>
              <p className="text-sm text-gray-300">Gestión de tus paquetes</p>
            </div>
            <Package className="w-8 h-8 text-purple-100" />
          </div>
          <ul className="text-sm space-y-1">
            <li>Total: {paquetes.total}</li>
            <li className="text-blue-200">En tránsito: {paquetes.transito}</li>
            <li className="text-yellow-200">Pendientes: {paquetes.pendientes}</li>
          </ul>
        </motion.div>

        {/* Facturas */}
        <motion.div
          className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl p-6 shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Mis facturas</h2>
              <p className="text-sm text-gray-300">Resumen de tus pagos</p>
            </div>
            <FileText className="w-8 h-8 text-blue-100" />
          </div>
          <ul className="text-sm space-y-1">
            <li className="text-yellow-100">Pendientes: {facturas.pendientes}</li>
            <li className="text-green-200">Pagadas: {facturas.pagadas}</li>
          </ul>
        </motion.div>

        {/* Último envío */}
        <motion.div
          className="bg-gradient-to-br from-purple-100 to-purple-300 text-black rounded-2xl p-6 shadow-md hover:shadow-xl transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Último envío</h2>
              <p className="text-sm text-gray-700">Estado más reciente</p>
            </div>
            <Truck className="w-8 h-8 text-purple-800" />
          </div>
          <ul className="text-sm space-y-1">
            <li>Código: {ultimoEnvio.codigo}</li>
            <li className="text-blue-700">Estado: {ultimoEnvio.estado}</li>
          </ul>
        </motion.div>
      </section>
    </motion.div>
  );
}