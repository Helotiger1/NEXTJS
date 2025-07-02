import DynamicForm, { Field } from '@/app/(roles)/(shared)/components/forms/DynamicForm';

export function RegisterPackageForm() {


  const formConfig : Field[] = [
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

  return (
    <DynamicForm config={formConfig} onSubmit={()=>{}}></DynamicForm>
  )
}



