import { BaseLayout } from "../BaseLayout";
import {
  Home,
  PackageSearch,
  ClipboardList,
  Users,
} from 'lucide-react';

const empleadoSidebar = {
  SidebarItems: [
    { href: "/empleado/inicio", icon: <Home className="h-5 w-5" />, label: "Inicio" },
    { href: "/empleado/paquetes", icon: <PackageSearch className="h-5 w-5" />, label: "Paquetes" },
    { href: "/empleado/facturas", icon: <ClipboardList className="h-5 w-5" />, label: "Facturas" },
    { href: "/empleado/clientes", icon: <Users className="h-5 w-5" />, label: "Clientes" },
  ],
  profileURL: "/empleado/perfil",
};

export default function EmpleadoLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout
      profileURL={empleadoSidebar.profileURL}
      sidebarItems={empleadoSidebar.SidebarItems}
    >
      {children}
    </BaseLayout>
  );
}