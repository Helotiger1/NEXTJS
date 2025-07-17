'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  UserCircle,
  LogOut,
} from 'lucide-react';

type SidebarItem = {
  href: string;
  icon: React.ReactNode;
  label: string;
};

type BaseLayoutProps = {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  profileURL: string;
};

export function BaseLayout({
  children,
  sidebarItems,
  profileURL,
}: BaseLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="grid grid-rows-[1fr_auto] grid-cols-[16rem_1fr] min-h-screen bg-black text-white overflow-visible">
      {/* Sidebar */}
      <aside className="bg-[#313793] p-6 sticky top-0 h-screen flex flex-col">
        {/* Perfil */}
        <Link href={profileURL}>
          <div className="mb-8 p-4 rounded-md hover:bg-[#3f44d3] transition flex items-center justify-center gap-2">
            <UserCircle className="h-6 w-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Perfil</h2>
          </div>
        </Link>

        {/* Navegación */}
        <nav className="flex flex-col gap-2">
          {sidebarItems.map(({ href, icon, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 text-lg font-semibold rounded-l-xl transition ${
                  isActive
                    ? 'bg-black text-white shadow-inner'
                    : 'text-white hover:bg-[#3f44d3] hover:text-white'
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Botón cerrar sesión */}
        <button
          onClick={() => {
            sessionStorage.removeItem('bienvenida-mostrada');
            router.push('/');
          }}
          className="mt-auto flex items-center gap-2 px-4 py-2 rounded-md text-white bg-black hover:bg-red-700 transition"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal con fondo heredado negro */}
      <section className="p-6 overflow-auto bg-black text-white">
        {children}
      </section>

      {/* Footer */}
      <footer className="col-span-2 text-center py-4 text-sm text-gray-500">
        "CargoTruck 2025 — All rights reserved 🚛"
      </footer>
    </div>
  );
}