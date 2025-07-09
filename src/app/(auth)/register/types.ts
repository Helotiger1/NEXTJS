export type RegisterFormProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: {
    nombre: string;
    apellido : string;
    cedula : string;
    telefono: string
    email: string;
    contra : string;
    contraconfirm: string;

  };
};