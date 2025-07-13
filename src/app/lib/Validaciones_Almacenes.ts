import prisma from '@lib/prisma';

export type DireccionInput = {
  linea1?: string;
  linea2?: string;
  pais?: string;
  estado?: string;
  ciudad?: string;
  codigoPostal: number|string;
}

export function validarDireccion(direccion: Partial<DireccionInput>): string[] {
  const errores: string[] = [];
  
  // Solo valida los campos que están presentes en el objeto
  if ('linea1' in direccion && !direccion.linea1?.trim()) {
    errores.push("La línea 1 de la dirección es obligatoria");
  }
  
  if ('pais' in direccion && !direccion.pais?.trim()) {
    errores.push("El campo pais es obligatorio en la dirección");
  }
  
  if ('estado' in direccion && !direccion.estado?.trim()) {
    errores.push("El campo estado es obligatorio en la dirección");
  }
  
  if ('ciudad' in direccion && !direccion.ciudad?.trim()) {
    errores.push("El campo ciudad es obligatorio en la dirección");
  }
  
  if ('codigoPostal' in direccion && !direccion.codigoPostal?.toString().trim()) {
    errores.push("El campo codigoPostal es obligatorio en la dirección");
  }
  
  return errores;
}

export function validarTelefono(telefono: string | number | undefined): string[] {
  const errors: string[] = [];
  
  if (!telefono || telefono.toString().trim() === '') {
    errors.push('El teléfono es obligatorio');
  } else {
    const regex = /^\d{7,15}$/;
    if (!regex.test(telefono.toString())) {
      errors.push('El teléfono debe contener solo números y tener entre 7 y 15 dígitos');
    }
  }

  return errors;
}

export async function validarAlmacenUnico(data: {
  telefono: string | number;
  direccion: DireccionInput;
}): Promise<string[]> {
  const errors: string[] = [];
  
  try {
    const almacenExistente = await prisma.almacen.findFirst({
      where: {
        telefono: data.telefono.toString(),
        direccion: {
          linea1: data.direccion.linea1,
          ciudad: data.direccion.ciudad,
          codigoPostal: Number(data.direccion.codigoPostal)
        }
      },
      select: { codigo: true }
    });

    if (almacenExistente) {
      errors.push('Ya existe un almacén con el mismo teléfono y dirección');
    }
  } catch {
    errors.push('Error al verificar unicidad del almacén');
  }

  return errors;
}

export function validarAlmacenCompleto(data: {
  telefono: string | number | undefined;
  direccion: DireccionInput;
}): string[] {
  return [
    ...validarTelefono(data.telefono),
    ...validarDireccion(data.direccion)
  ];
}