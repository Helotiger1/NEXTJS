type Props = {
  name: string
};

export default function SectionHeader({ name }: Props) {
  return (
    <div className="space-y-6 mb-6">
      <h1 className="text-3xl font-semibold text-gray-900">{name}</h1>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="🔍 Buscar por tracking..."
          className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm transition-all text-gray-700"
        />

        <select
          className="border border-gray-300 focus:border-purple-600 focus:ring-purple-600 rounded-lg px-4 py-2 w-full md:w-1/3 shadow-sm transition-all text-gray-700"
        >
          <option value="">🎯 Todos los estados</option>
          <option value="REGISTRADO">📝 Registrado</option>
          <option value="EN_TRANSITO">🚚 En tránsito</option>
          <option value="EN_ALMACEN">📦 En almacén</option>
          <option value="ENTREGADO">✅ Entregado</option>
          <option value="CANCELADO">❌ Cancelado</option>
        </select>

        <button
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-all text-sm shadow-sm w-full md:w-auto"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
}
