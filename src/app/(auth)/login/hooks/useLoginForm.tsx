'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginService } from '@/app/services/loginService';

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipo = searchParams.get('tipo');

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const usuario = await loginService({
        email: form.email,
        contraseña: form.password,
      });

      localStorage.setItem('user', JSON.stringify(usuario));
      console.log(usuario);
      console.log(`/${tipo || 'cliente'}/inicio`)
      router.push(`/${tipo || 'cliente'}/inicio`);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    loading,
  };
}