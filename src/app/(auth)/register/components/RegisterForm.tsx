import Link from "next/link";

export type RegisterFormProps = {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

export const RegisterForm = ({ onChange, onSubmit }: RegisterFormProps) => {
    return (
       <div className="flex min-h-screen items-center justify-center p-4">
    <form
        onSubmit={onSubmit}
        className="w-full max-w-xs space-y-3 rounded-xl bg-white p-4 shadow text-black">
        <h2 className="text-center text-xl font-semibold">Registrarse</h2>

        <div>
            <label className="block text-sm font-medium">Nombre</label>
            <input
                type="text"
                name="firstName"
                className="mt-1 w-full rounded-md border-[0.5px] px-3 py-1.5 text-xs border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Apellido</label>
            <input
                type="text"
                name="lastName"
                className="mt-1 w-full rounded-md border-[0.5px] px-3 py-1.5 text-xs border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Cédula</label>
            <input
                type="text"
                name="ci"
                className="mt-1 w-full rounded-md border-[0.5px] px-3 py-1.5 text-xs border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Teléfono</label>
            <input
                type="tel"
                name="phone"
                className="mt-1 w-full rounded-md border-[0.5px] px-3 py-1.5 text-xs border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Email</label>
            <input
                type="email"
                name="email"
                className="mt-1 w-full rounded-md border-[0.5px] px-3 py-1.5 text-xs border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
                type="password"
                name="password"
                className="mt-1 w-full rounded-md border-[0.5px] px-3 py-1.5 text-xs border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
                required
            />
        </div>

        <div>
            <label className="block text-sm font-medium">Confirmar contraseña</label>
            <input
                type="password"
                name="confirmPassword"
                className="mt-1 w-full rounded-md border-[0.5px] px-3 py-1.5 text-xs border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={onChange}
                required
            />
        </div>

        <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-1.5 text-sm text-white hover:bg-blue-700 transition">
            Registrarse
        </button>
        <p className="text-sm text-center">
            ¿Ya estás registrado?{" "}
            <Link href="/login" className="text-blue-900 hover:underline">
                Inicia sesión
            </Link>
        </p>
    </form>
</div>

    );
};
