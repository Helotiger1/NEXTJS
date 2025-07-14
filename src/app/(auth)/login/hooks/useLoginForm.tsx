'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams(); // <- aquí accedes a los parámetros de la URL

  const tipo = searchParams.get('tipo'); // <- esto te da "empleado", "cliente", etc.

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    const user = {
      nombre: 'Juan Pérez',
      rol: tipo || 'cliente', // ← usa el tipo de la URL como rol
      id : 2
    };

    localStorage.setItem('user', JSON.stringify(user));
    router.push(`/${tipo || 'cliente'}/inicio`); // ← redirige al tipo adecuado
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
}
