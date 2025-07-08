"use client";
import { LoginForm } from "./components/LoginForm";
import { useLoginForm } from "./hooks/useLoginForm";

export default function LoginPage() {
  const { handleChange, handleSubmit, form } = useLoginForm();

  return (
    <LoginForm
      onChange={handleChange}
      onSubmit={handleSubmit}
      form={form}
    />
  );
}