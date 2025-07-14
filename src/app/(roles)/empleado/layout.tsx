'use client';

import { BaseLayout } from '../BaseLayout';
import { SidebarConfig } from '@/app/types/utils';

import {
  Home,
  PackageSearch,
  ClipboardList,
  Plane,
  Boxes,
  Users,
  Shield
} from 'lucide-react';


const empleadoSidebar: SidebarConfig = {
  SidebarItems: [
    { href: '/empleado/inicio', icon: <Home className="h-5 w-5" />, label: 'Inicio' },
    { href: '/empleado/paquetes', icon: <PackageSearch className="h-5 w-5" />, label: 'Paquetes' },
    { href: '/empleado/envios', icon: <Plane className="h-5 w-5" />, label: 'Registrar envíos' },
    { href: '/empleado/estado', icon: <Boxes className="h-5 w-5" />, label: 'Estados de envíos' },
    { href: '/empleado/clientes', icon: <Users className="h-5 w-5" />, label: 'Clientes' },
    { href: '/admin/inicio', icon: <Shield className="h-5 w-5" />, label: 'Sección admin' },

  ],
  profileURL: '/empleado/perfil',
};

export default function EmpleadoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout
      profileURL={empleadoSidebar.profileURL}
      sidebarItems={empleadoSidebar.SidebarItems}
    >
      {children}
    </BaseLayout>
  );
}