import React, { ReactNode } from "react";
import { GenericButton } from "../../(shared)/components/buttons/GenericButton";

export default function DynamicHeader({
    h1Text,
    children,
}: {
    h1Text: string;
    children: ReactNode;
}) {
    return (
        <header>
            <div className="space-y-6 mb-6">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900">
                    {h1Text}
                    {children}
                </h1>

                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="🔍 Busqueda por identificador"
                        className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm transition-all text-gray-700"
                    />
                    <GenericButton
                        type="button"
                        content="Buscar"></GenericButton>
                </div>
            </div>
        </header>
    );
}
