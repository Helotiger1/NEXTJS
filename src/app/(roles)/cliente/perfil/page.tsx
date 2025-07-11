'use client';

import { UserCircle, MailOpen, PhoneCall, MapPinned } from 'lucide-react';
import Link from 'next/link';

export default function PerfilClientePage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Tarjeta blanca sobre fondo negro heredado */}
      <div className="bg-white text-black p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-purple-600" />
          Mi perfil
        </h2>

        <ul className="space-y-4 text-lg">
          <li className="flex items-center gap-3">
            <MailOpen className="h-5 w-5 text-purple-500" />
            <span>juanperez@example.com</span>
          </li>
          <li className="flex items-center gap-3">
            <PhoneCall className="h-5 w-5 text-purple-500" />
            <span>00000000000</span>
          </li>
          <li className="flex items-center gap-3">
            <MapPinned className="h-5 w-5 text-purple-500" />
            <span>Avenida venga la alegría</span>
          </li>
        </ul>

        <div className="mt-6 text-right">
          <Link href="/cliente/perfil/editar">
            <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">
              Editar perfil
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}