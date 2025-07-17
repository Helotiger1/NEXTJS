"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface User {
  nombre: string;
  email: string;
  telefono: string;
  cedula: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        console.warn("No se pudo parsear el usuario almacenado");
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <p className="text-white text-center mt-8">
        Cargando usuario...
      </p>
    );
  }

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-black text-white font-sans p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center p-8 rounded-xl max-w-xl w-full shadow-lg bg-gray-900">
        <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center mb-6">
          <svg
            className="w-20 h-20 text-black"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-2">{user.nombre}</h1>
        <p className="text-lg text-gray-400 mb-10">{user.email}</p>

        <div className="text-center w-full mb-10">
          <h2 className="text-2xl font-semibold mb-4">Información</h2>
          <div className="text-lg leading-relaxed max-w-md mx-auto flex flex-col gap-3">
            <div className="flex justify-between items-center w-full">
              <span className="font-bold text-gray-400">Teléfono:</span>
              <span className="text-gray-300">{user.telefono}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-bold text-gray-400">Email:</span>
              <span className="text-gray-300">{user.email}</span>
            </div>
            <div className="flex justify-between items-center w-full">
              <span className="font-bold text-gray-400">Cédula:</span>
              <span className="text-gray-300">{user.cedula}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
