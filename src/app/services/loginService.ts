import api from '@/app/lib/axios'; // o la ruta correspondiente a tu instancia
// Ajusta esta ruta si tu archivo está en otro lado

export interface LoginCredentials {
  email: string;
  contraseña: string;
}

export interface Usuario {
  id: number;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  roles: string[];
}

export async function loginService(credentials: LoginCredentials): Promise<Usuario> {
  try {
    const response = await api.post('/login', credentials);
    return response.data.usuario;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || 'Error al iniciar sesión');
  }
}