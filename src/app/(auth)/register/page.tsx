"use client";
import { RegisterForm } from "./components/RegisterForm";
import { useRegisterForm } from "./hooks/useRegisterForm";
import PageTransition from "../../components/PageTransition";

export default function RegisterPage() {
  const { handleChange, handleSubmit, form } = useRegisterForm();

  return (
    <PageTransition>
      <RegisterForm
        onChange={handleChange}
        onSubmit={handleSubmit}
        form={form}
      />
    </PageTransition>
  );
}