"use client";
import { BaseLayout } from "../BaseLayout";
import {
  Home,
  PackageSearch,
  Users, ClipboardList
} from 'lucide-react';

import { SidebarConfig } from "@/app/types/utils";

const clienteSidebar: SidebarConfig = {
  SidebarItems: [
    { href: "/empleado/inicio",  icon: <Home className="h-5 w-5" />, label: "Inicio" },
    { href: "/empleado/paquetes",  icon: <PackageSearch className="h-5 w-5" />, label: "Paquetes" },
    { href: "/empleado/facturas", icon: <ClipboardList className="h-5 w-5" />, label: "Facturas" },
    { href: "/empleado/envios", icon: "✈️", label: "Registrar envios" },
    { href: "/empleado/estado", icon: "📍", label: "Estados de envios" },
    { href: "/empleado/clientes", icon: <Users className="h-5 w-5" />, label: "Clientes" },
    { href: "/admin/inicio", icon: "🛡️", label: "Sección admin" },
  ],
  profileURL: "/empleado/perfil",
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout
      profileURL={clienteSidebar.profileURL}
      sidebarItems={clienteSidebar.SidebarItems}
    >
      {children}
    </BaseLayout>
  );
}
