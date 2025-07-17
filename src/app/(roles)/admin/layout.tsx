"use client";

import { BaseLayout } from "../BaseLayout";
import { SidebarConfig } from "@/app/types/utils";
import {
  Home,
  User,
  Warehouse,
  Users,
} from "lucide-react"; // <-- Importamos los íconos necesarios

const clienteSidebar: SidebarConfig = {
  SidebarItems: [
    { href: "/admin/inicio", icon: <Home className="w-5 h-5" />, label: "Inicio" },
    { href: "/admin/usuarios", icon: <User className="w-5 h-5" />, label: "Usuarios" },
    { href: "/admin/almacen", icon: <Warehouse className="w-5 h-5" />, label: "Almacenes" },
    {
      href: "/empleado/inicio",
      icon: <Users className="w-5 h-5" />,
      label: "Sección empleados",
    },
  ],
  profileURL: "/admin/perfil",
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseLayout
      sidebarItems={clienteSidebar.SidebarItems}
      profileURL={clienteSidebar.profileURL}
    >
      {children}
    </BaseLayout>
  );
}
