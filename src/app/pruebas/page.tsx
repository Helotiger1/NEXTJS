"use client"
import DynamicTable from "../(roles)/(shared)/components/tables/DynamicTable";
const data = [
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },
  { id: 1, name: "Carlos", email: "carlos@mail.com" },
  { id: 2, name: "Laura", email: "laura@mail.com" },
  { id: 3, name: "Ana", email: "ana@mail.com" },
  { id: 4, name: "Pedro", email: "pedro@mail.com" },
  { id: 5, name: "María", email: "maria@mail.com" },
  { id: 6, name: "Luis", email: "luis@mail.com" },

];

const columns = [
  { key: "name", label: "Nombre" },
  { key: "email", label: "Correo" },
  {
    key: "acciones",
    label: "Acciones",
    render: (_ :any , row:any) => (
      <button
        onClick={() => alert(`Detalles de ${row.name}`)}
        className="text-blue-600 underline"
      >
        Ver detalles
      </button>
    )
  }
];

export default function App() {
  return <DynamicTable columns={columns} data={data} rowsPerPage={9} />;
}