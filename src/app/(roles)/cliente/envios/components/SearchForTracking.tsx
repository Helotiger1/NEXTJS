import React from "react";

export default function SearchForTracking() {
    return (
        <>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar envíos por tracking de un paquete
                </label>
                <input
                    type="text"
                    placeholder="Ej: TRK-1002"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </>
    );
}
