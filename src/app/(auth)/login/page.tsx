"use client";
import { LoginForm } from "./components/LoginForm";
import { useLoginForm } from "./hooks/useLoginForm";
import PageTransition from "../../components/PageTransition";

export default function LoginPage() {
  const { handleChange, handleSubmit, form } = useLoginForm();

  return (
    <PageTransition>
      <LoginForm
        onChange={handleChange}
        onSubmit={handleSubmit}
        form={form}
      />
    </PageTransition>
  );
}