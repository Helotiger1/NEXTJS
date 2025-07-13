
 export const getColumns = (setModalInfo: any) => [
    { key: "cedula", label: "Cedula" },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "email", label: "Email" },
    { key: "telefono", label: "Telefono" },
    {
      key: "ver_paquetes",
      label: "Ver paquetes",
      render: (_: any, row: any) => (
        <button
          onClick={() => setModalInfo({ tipo: "paquetes", id: row.id })}
          className="text-blue-600 underline"
        >
          Ver paquetes
        </button>
      ),
    },
    {
      key: "ver_facturas",
      label: "Ver facturas",
      render: (_: any, row: any) => (
        <button
          onClick={() => setModalInfo({ tipo: "facturas", id: row.id })}
          className="text-blue-600 underline"
        >
          Ver facturas
        </button>
      ),
    },
  ];
