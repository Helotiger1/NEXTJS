'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCircle, MailOpen, PhoneCall, MapPinned } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditarPerfilCliente() {
  const router = useRouter();

  // Datos simulados (cargarán desde backend luego)
  const originalData = {
    nombre: 'Juan Pérez',
    email: 'juanperez@example.com',
    telefono: '00000000000',
    direccion: 'Avenida venga la alegría',
  };

  const [formData, setFormData] = useState(originalData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGuardar = () => {
    // Aquí iría el fetch o actualización real
   toast.success('Cambios guardados correctamente');
setTimeout(() => {
  router.push('/cliente/perfil');
}, 1500); // Espera 1.5s para que se vea la notificación
  };

  const handleCancelar = () => {
    router.push('/cliente/perfil');
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex items-center justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-extrabold text-purple-800 mb-8">
          Editar Perfil
        </h2>

        <form className="space-y-6 text-gray-700">
          {/* Nombre */}
          <div>
            <label className="text-sm mb-1 block">Nombre</label>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-purple-500" />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm mb-1 block">Correo electrónico</label>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-purple-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-sm mb-1 block">Teléfono</label>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-purple-500" />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="text-sm mb-1 block">Dirección</label>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-purple-500" />
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
              />
            </div>
          </div>
        </form>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={handleCancelar}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition font-medium shadow"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </motion.div>
  );
}