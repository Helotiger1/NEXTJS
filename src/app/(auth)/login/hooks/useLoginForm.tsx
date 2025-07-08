import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get("tipo"); // "clientee" o "empleado"

 const [form, setForm] = useState({
  email: "",
  password: "",
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginCorrecto = true;

    if (!loginCorrecto) {
      alert("Datos inválidos");
      return;
    }

    if (tipo === "cliente") router.push("/cliente/inicio");
    else if (tipo === "empleado") router.push("/empleado/inicio");
    else router.push("/");
  };

  return {
    handleChange,
    handleSubmit,
    form,
  };
}