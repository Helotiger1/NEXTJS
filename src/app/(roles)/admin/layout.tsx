import { BaseLayout } from "../BaseLayout";
import { SidebarItem } from "@/app/types/utils";

const clienteSidebar: SidebarItem[] = [
    { href: "/admin/inicio", icon: "🏠", label: "Inicio" },
    { href: "/admin/usuarios", icon: "nose", label: "Usuarios" },
    { href: "/admin/almacen", icon: "🧾", label: "Almacen" },
    { href: "/admin/envios", icon: "🚚", label: "Envíos" },
    { href: "/admin/paquetes", icon: "📦", label: "Paquetes" },
    { href: "/admin/clientes", icon: "nose", label: "Clientes" },
    { href: "/admin/facturas", icon: "nose", label: "Facturas" },
];

export default function ClienteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <BaseLayout sidebarItems={clienteSidebar}>{children}</BaseLayout>;
}
