"use client";
import Link from "next/link";
import { useState } from "react";

export type LoginFormProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  form: {
    ci: string;
    password: string;
  };
};

// Componente de input con etiqueta flotantee
function FloatingLabelInput({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const showLabel = isFocused || value !== "";

  return (
    <div className="relative w-full">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="peer w-full border-b border-gray-500 bg-transparent px-1 pt-6 pb-2 text-white placeholder-transparent focus:border-purple-400 focus:outline-none focus:ring-0"
        placeholder={label}
        required
      />
      <label
        className={`absolute left-1 text-sm transition-all ${
          showLabel
            ? "text-purple-400 text-xs -top-1"
            : "text-gray-400 top-6"
        }`}
      >
        {label}
      </label>
    </div>
  );
}

// Componente principal
export const LoginForm = ({ onChange, onSubmit, form }: LoginFormProps) => {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Fondo diagonal morado a negro */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-800 to-black clip-diagonal z-0 hidden md:block" />

      {/* Mensaje de bienvenida */}
      <div className="absolute inset-0 z-10 hidden md:flex items-center justify-start px-20">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-4">¡Bienvenido!</h2>
          <p className="text-lg text-gray-200">
            Accede a tu cuenta para rastrear paquetes, pagar facturas y más.
          </p>
        </div>
      </div>

      {/* Formulario (lado negro) */}
      <div className="relative z-20 flex justify-end w-full px-8">
        <div className="max-w-sm w-full bg-transparent p-6 space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center">Iniciar sesión</h2>

            <FloatingLabelInput
  name="email"
  label="Correo electrónico"
  type="email"
  value={form.email}
  onChange={onChange}
/>

            <FloatingLabelInput
              name="password"
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={onChange}
            />

            <button
              type="submit"
              className="w-full rounded-md bg-purple-700 py-2 text-white font-semibold hover:bg-purple-800 transition"
            >
              Ingresar
            </button>

            <p className="text-sm text-center">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="underline text-purple-300 hover:text-white">
                Regístrate aquí
              </Link>
            </p>

            <p className="text-sm text-center">
              ¿Olvidaste tu contraseña?{" "}
              <Link href="/recovery" className="underline text-purple-300 hover:text-white">
                Recuperar
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};