import Link from "next/link";
import { BaseLayoutProps } from "../types/props";

export function BaseLayout({children, sidebarItems, profileURL}: BaseLayoutProps) {
    return (
        <div className="grid grid-rows-[1fr_auto] grid-cols-[16rem_1fr] min-h-screen text-white overflow-visible">
            <aside className="bg-principal p-6 sticky top-0 h-screen rounded-br">
                <Link href={profileURL}>
                <div className="mb-8 p-4 rounded-md hover:bg-blue-100 transition">
                    <h2 className="text-2xl font-bold text-center hover:text-blue-700">Perfil</h2>
                </div>
                </Link>
                <div className="grid gap-2 text-base">
                    {sidebarItems.map(({ href, icon, label }) => (
                        <div
                            key={href}
                            className="rounded-md hover:bg-blue-100 transition">
                            <Link
                                href={href}
                                className="block px-4 py-2 hover:text-blue-700 text-xl font-semibold">
                                {icon} {label}
                            </Link>
                        </div>
                    ))}
                </div>
            </aside>

            <section className="p-6 overflow-auto">{children}</section>

            <footer className="col-span-2 text-center py-4 text-sm">
                "CargoTruck 2025 — All rights reserved 🚛"
            </footer>
        </div>
    );
}
