"use client";

import { BaseLayout } from "../BaseLayout";
import { SidebarConfig } from "@/app/types/utils";

const clienteSidebar: SidebarConfig = {
  SidebarItems: [
    { href: "/admin/inicio", icon: "🏠", label: "Inicio" },
    { href: "/admin/usuarios", icon: "👤", label: "Registrar usuarios" },
    { href: "/admin/almacen", icon: "🧾", label: "Registrar almacenes" },
    { href: "/empleado/inicio", icon: "👥", label: "Sección empleados" },
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
