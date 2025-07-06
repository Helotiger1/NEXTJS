 import { EditState } from "./components/EditState";
 import { Field } from "../../(shared)/components/forms/types";
 export const data :any = [{
  cod: "001",
  origen: "Doral",
  destino: "Maracaibo",
  f_sal: "2025-07-01",
  tipo: "Avion",
  estado: "En transito"
},{
  cod: "002",
  origen: "Doral",
  destino: "Maracaibo",
  f_sal: "2025-07-01",
  tipo: "Barco",
  estado: "Recibido"
},

]
   export const columns = [
        { key: "cod", label: "Codigo de envio" },
        { key: "origen", label: "Origen" },
        { key: "destino", label: "Destino" },
        { key: "f_sal", label: "Fecha Salida" },
        { key: "tipo", label: "Tipo" },
  {
    key: "acciones",
    label: "Estado",
    render: (_ :any , row:any) => (
      <EditState initial={row.estado} onChange={()=>{}}></EditState>
    )
  }

    ];

     export  const formConfig : Field[] = [
  {
    name: "1",
    label: "Remitente",
    type: "text",
  },
  {
    name: "2",
    label: "Destinatario",
    type: "text",
  },
  {
    name: "3",
    label: "Peso",
    type: "text",
  },
  {
    name: "4",
    label: "Tamaño",
    type: "text",
  },
  {
    name: "5",
    label: "Direccion",
    type: "text",
  },
];