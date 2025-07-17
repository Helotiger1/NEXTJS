'use client';

import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-800 to-black clip-diagonal z-0 hidden md:block" />

      <div className="relative z-20 flex justify-end w-full px-8">
        <div className="max-w-sm w-full bg-transparent p-6 space-y-6 text-center">
          <h2 className="text-2xl font-semibold text-white">Acceso denegado</h2>

          <p className="text-md text-gray-300">
            No tienes permisos para acceder a esta página. Por favor, vuelve a iniciar sesión con una cuenta autorizada.
          </p>


                    <button   className="inline-block w-full rounded-md bg-purple-700 py-2 text-white font-semibold hover:bg-purple-800 transition" onClick={() => history.back()}>
  Volver atrás
</button>
        </div>
      </div>
    </div>
  );
}
