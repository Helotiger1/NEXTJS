import { BaseLayout } from "../BaseLayout";
import { SidebarItem } from "@/app/types/utils";

const clienteSidebar: SidebarItem[] = [
    { href: "/empleado/inicio", icon: "🏠", label: "Inicio" },
    { href: "/empleado/registrar", icon: "🚚", label: "Registrar" },
    { href: "/empleado/estado", icon: "nose", label: "Estado" },
    { href: "/empleado/asociar", icon: "🧾", label: "Asociar" },
    { href: "/empleado/paquetes", icon: "📦", label: "Paquetes" },
    { href: "/empleado/clientes", icon: "nose", label: "Clientes" },
];

export default function ClienteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <BaseLayout sidebarItems={clienteSidebar}>{children}</BaseLayout>;
}
