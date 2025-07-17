export type UsuarioInput = {
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  contrasena: string;
  rol?: string; 
};

export const validarUsuario = (usuario: UsuarioInput): string[] => {
    const errors: string[] = [];
    
    // Validar campos requeridos (con protección contra undefined/null)
    if (!usuario?.cedula || typeof usuario.cedula !== 'string' || !usuario.cedula.trim()) {
        errors.push("La cédula es requerida");
    }
    
    if (!usuario?.nombre || typeof usuario.nombre !== 'string' || !usuario.nombre.trim()) {
        errors.push("El nombre es requerido");
    }
    
    if (!usuario?.apellido || typeof usuario.apellido !== 'string' || !usuario.apellido.trim()) {
        errors.push("El apellido es requerido");
    }
    
    if (!usuario?.email || typeof usuario.email !== 'string' || !usuario.email.trim()) {
        errors.push("El email es requerido");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
        errors.push("El email no es válido");
    }
    
    if (!usuario?.telefono || typeof usuario.telefono !== 'string' || !usuario.telefono.trim()) {
        errors.push("El teléfono es requerido");
    }
    
    if (!usuario?.contrasena || typeof usuario.contrasena !== 'string') {
        errors.push("La contraseña es requerida");
    } else if (usuario.contrasena.length < 8) {
        errors.push("La contraseña debe tener al menos 8 caracteres");
    }
    console.log(errors)
    return errors;
};