import { BaseLayout} from "../BaseLayout";
import { SidebarItem } from "@/app/types/utils";

const clienteSidebar: SidebarItem[] = [
  { href: "/cliente/inicio", icon: "🏠", label: "Inicio" },
  { href: "/cliente/paquetes", icon: "📦", label: "Paquetes" },
  { href: "/cliente/facturas", icon: "🧾", label: "Facturas" },
  { href: "/cliente/envios", icon: "🚚", label: "Envíos" },
];

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout sidebarItems={clienteSidebar}>{children}</BaseLayout>;
}




