"use client";
import { RegisterForm } from "./components/RegisterForm";
import { useRegisterForm } from "./hooks/useRegisterForm";

export default function RegisterPage() {
  const { form, handleChange, handleSubmit } = useRegisterForm();

  return (
    <RegisterForm
      form={form}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}