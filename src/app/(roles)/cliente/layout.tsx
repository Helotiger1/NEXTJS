import { BaseLayout} from "../BaseLayout";
import { SidebarConfig} from "@/app/types/utils";

const clienteSidebar: SidebarConfig= { SidebarItems: [
  { href: "/cliente/inicio", icon: "🏠", label: "Inicio" },
  { href: "/cliente/paquetes", icon: "📦", label: "Paquetes" },
  { href: "/cliente/facturas", icon: "🧾", label: "Facturas" },
  { href: "/cliente/envios", icon: "🚚", label: "Envíos" },
], profileURL : "/cliente/perfil"};

export default function ClienteLayout({ children }: { children: React.ReactNode }) {
  return <BaseLayout  profileURL={clienteSidebar.profileURL} sidebarItems={clienteSidebar.SidebarItems}>{children}</BaseLayout>;
}




