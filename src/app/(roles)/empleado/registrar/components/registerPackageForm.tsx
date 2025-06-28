import FormInput from '@/app/(roles)/(shared)/components/forms/FormInput'
import FormWrapper from '@/app/(roles)/(shared)/components/forms/FormWrapper'
import React from 'react'

export default function registerPackageForm() {


    export const formConfig = [
  {
    name: "name",
    label: "Nombre",
    type: "text",
  },
  {
    name: "email",
    label: "Correo",
    type: "email",
  },
  {
    name: "gender",
    label: "Género",
    type: "select",
    options: [
      { value: "", label: "Seleccione" },
      { value: "M", label: "Masculino" },
      { value: "F", label: "Femenino" },
    ],
  },
  {
    name: "newsletter",
    label: "Suscribirse al boletín",
    type: "checkbox",
  },
];

  return (
    <FormWrapper onSubmit={()=>}>
        <FormInput label="Nombre" name="name" />
      <FormInput label="Correo" name="email" type="email" />
      <FormInput label="Teléfono" name="phone" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Enviar
      </button>
    </FormWrapper>
  )
}
