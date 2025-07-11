'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useLoginForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación ficticia
    if (!form.email || !form.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    // Simular login correcto
    const user = {
      nombre: 'Juan Pérez',
      rol: 'cliente',
    };

    localStorage.setItem('user', JSON.stringify(user));
    router.push('/cliente/inicio');
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
}