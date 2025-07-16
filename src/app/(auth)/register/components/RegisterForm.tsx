"use client";
import Link from "next/link";
import FloatingInput from "../../login/components/FloatingInput";
import { GenericButton } from "@/app/(roles)/(shared)/components/buttons/GenericButton";
import RegisterHeaderForm from "./RegisterHeaderForm";
import { RegisterFormProps } from "../types";

export const RegisterForm = ({
    onChange,
    onSubmit,
    form,
}: RegisterFormProps) => {
    return (
        <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-800 to-black clip-diagonal z-0 hidden md:block transform scale-x-[-1]" />
            <RegisterHeaderForm></RegisterHeaderForm>
            <div className="relative z-20 flex justify-start w-full px-8">
                <div className="max-w-sm w-full bg-transparent p-6 space-y-6">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <h2 className="text-2xl font-semibold text-white text-center">
                            Crear cuenta
                        </h2>

                        <FloatingInput
                            name="nombre"
                            label="Nombre"
                            value={form.nombre}
                            onChange={onChange}
                        />

                        <FloatingInput
                            name="apellido"
                            label="Apellido"
                            value={form.apellido}
                            onChange={onChange}
                        />

                        <FloatingInput
                            name="cedula"
                            label="Cédula"
                            value={form.cedula}
                            onChange={onChange}
                        />

                        <FloatingInput
                            name="telefono"
                            label="Teléfono"
                            value={form.telefono}
                            onChange={onChange}
                        />

                        <FloatingInput
                            name="email"
                            label="Correo electrónico"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                        />

                        <FloatingInput
                            name="contrasena"
                            label="Contraseña"
                            type="password"
                            value={form.contra}
                            onChange={onChange}
                        />

                        <GenericButton
                            className="w-full rounded-md bg-purple-700 py-2 text-white font-semibold hover:bg-purple-800 transition"
                            type="submit"
                            content="Registrarse"
                        />

                        <p className="text-sm text-center">
                            ¿Ya tienes cuenta?{" "}
                            <Link
                                href="/login"
                                className="underline text-purple-300 hover:text-white">
                                Inicia sesión
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};