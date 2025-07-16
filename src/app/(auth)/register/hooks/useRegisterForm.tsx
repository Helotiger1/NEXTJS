import { useState } from "react";
import { useRouter } from "next/navigation";
import { usuarioService } from "@/app/services/usuarioService";

export function useRegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono:"",
   contrasena: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await usuarioService.crear(form);
    alert("Usuario registrado exitosamente!")
    router.push("/login");
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
}