"use client";
import Link from "next/link";
import FloatingInput from "./FloatingInput";
import { GenericButton } from "@/app/(roles)/(shared)/components/buttons/GenericButton";
import { WelcomeHeader } from "./WelcomeHeader";
import { LoginFormProps } from "../types";



export const LoginForm = ({ onChange, onSubmit, form }: LoginFormProps) => {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-800 to-black clip-diagonal z-0 hidden md:block" />
      <WelcomeHeader></WelcomeHeader>
      <div className="relative z-20 flex justify-end w-full px-8">
        <div className="max-w-sm w-full bg-transparent p-6 space-y-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-white text-center">Iniciar sesión</h2>

            <FloatingInput
              name="email"
              label="Email"
              type="email"
              value={form.email}
              onChange={onChange}
            />

            <FloatingInput
              name="password"
              label="Contraseña"
              type="password"
              value={form.password}
              onChange={onChange}
            />

            <GenericButton content="Ingresar" type="submit" className="w-full rounded-md bg-purple-700 py-2 text-white font-semibold hover:bg-purple-800 transition"></GenericButton>
        

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