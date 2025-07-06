// Validaciones_Almacenes.ts

export type DireccionInput = {
  linea1?: string;
  linea2?: string;
  pais?: string;
  estado?: string;
  ciudad?: string;
  codigoPostal?: number | string;
};

export function validarDireccion(direccion: DireccionInput): string | null {
  const camposRequeridos = ['linea1', 'pais', 'estado', 'ciudad', 'codigoPostal'];
  for (const campo of camposRequeridos) {
    const valor = direccion[campo as keyof DireccionInput];
    if (!valor || valor.toString().trim() === '') {
      return `El campo ${campo} es obligatorio en la dirección`;
    }
  }
  return null;
}

export function validarTelefono(telefono: string | number | undefined): string | null {
  if (!telefono || telefono.toString().trim() === '') {
    return 'El teléfono es obligatorio';
  }
  const regex = /^\d{7,15}$/;
  if (!regex.test(telefono.toString())) {
    return 'El teléfono debe contener solo números y tener entre 7 y 15 dígitos';
  }
  return null;
}