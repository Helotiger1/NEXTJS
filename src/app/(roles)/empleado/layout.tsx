import { BaseLayout } from "../BaseLayout";
import { SidebarConfig, SidebarItem } from "@/app/types/utils";

const clienteSidebar: SidebarConfig = {SidebarItems: [
    { href: "/empleado/inicio", icon: "🏠", label: "Inicio" },
    { href: "/empleado/registrar", icon: "🚚", label: "Registrar" },
    { href: "/empleado/estado", icon: "nose", label: "Estado" },
    { href: "/empleado/asociar", icon: "🧾", label: "Asociar" },
    { href: "/empleado/paquetes", icon: "📦", label: "Paquetes" },
    { href: "/empleado/clientes", icon: "nose", label: "Clientes" },
    { href: "/admin/inicio", icon: "xd", label: "Seccion admin" }
],
profileURL : "/empleado/perfil"};

export default function ClienteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <BaseLayout profileURL={clienteSidebar.profileURL} sidebarItems={clienteSidebar.SidebarItems}>{children}</BaseLayout>;
}
