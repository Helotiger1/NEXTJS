import { BaseLayout } from "../BaseLayout";
import {
  Home,
  Package,
  FileText,
  Truck,
} from 'lucide-react';

const clienteSidebar = {
  SidebarItems: [
    { href: "/cliente/inicio", icon: <Home className="h-5 w-5" />, label: "Inicio" },
    { href: "/cliente/paquetes", icon: <Package className="h-5 w-5" />, label: "Paquetes" },
    { href: "/cliente/facturas", icon: <FileText className="h-5 w-5" />, label: "Facturas" },
    { href: "/cliente/envios", icon: <Truck className="h-5 w-5" />, label: "Envíos" },
  ],
  profileURL: "/cliente/perfil",
};

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLayout
      profileURL={clienteSidebar.profileURL}
      sidebarItems={clienteSidebar.SidebarItems}
    >
      {children}
    </BaseLayout>
  );
}