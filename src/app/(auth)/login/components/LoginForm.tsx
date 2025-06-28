import Link from "next/link";
export type LoginFormProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const LoginForm = ({ onChange, onSubmit }: LoginFormProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center text-black">
            <form
                onSubmit={onSubmit}
                className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-md">
                <h2 className="text-center text-2xl font-semibold text-black">
                    Iniciar sesión
                </h2>

                <div>
                    <label className="block text-sm font-medium">Cedula</label>
                    <input
                        name="ci"
                        className="mt-1 w-full rounded-xl border-gray-600 border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        onChange={onChange}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="mt-1 w-full rounded-xl border-gray-600 border px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        onChange={onChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-xl border-gray-600 bg-blue-600 py-2 text-white transition hover:bg-blue-700">
                    Ingresar
                </button>
                <p className="text-black">
                    ¿No tienes cuenta? Entonces{" "}
                    <Link
                        href="/register"
                        className="text-blue-900 hover:underline">
                        registrate.
                    </Link>
                </p>
                <p className="text-black">
                    ¿Olvidaste tus datos? Entonces{" "}
                    <Link
                        href="/recovery"
                        className="text-blue-900 hover:underline">
                        recupera tu usuario.
                    </Link>
                </p>
            </form>
        </div>
    );
};
