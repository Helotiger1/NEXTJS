import React from 'react'

export const CedulaFilter = () => {
  return (
    <div className="mb-4">
  <label className="block text-sm font-medium text-gray-100 mb-2">
    Cedula a la que asociar factura
  </label>
  <input
    type="text"
    placeholder="Ej: 12345678"
    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
  />
</div>
  )
}
