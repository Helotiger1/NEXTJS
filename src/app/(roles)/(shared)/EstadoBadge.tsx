export function EstadoBadge(estado: string) {
  const estilos: Record<string, string> = {
    REGISTRADO: 'bg-blue-100 text-blue-700',
    EN_TRANSITO: 'bg-yellow-100 text-yellow-700',
    EN_ALMACEN: 'bg-indigo-100 text-indigo-700',
    ENTREGADO: 'bg-green-100 text-green-700',
    CANCELADO: 'bg-red-100 text-red-700',
    PAGADA: 'bg-green-100 text-green-700',
    PENDIENTE: 'bg-yellow-100 text-yellow-700',
  };

  const estilo = estilos[estado] ?? 'bg-gray-100 text-gray-700';

  const label = capitalizeFirst(estado);

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold whitespace-nowrap ${estilo}`}>
      {label}
    </span>
  );
}

function capitalizeFirst(text: string) {
  const cleaned = text.toLowerCase().replaceAll('_', ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}
