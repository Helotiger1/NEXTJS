import { useState } from "react";
import { useRouter } from "next/navigation";

export function useRegisterForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    // Aquí iría el fetch a la API o lógica para registrar
    router.push("/login");
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
}