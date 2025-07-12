import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Función auxiliar para validar cédula (opcional)
function validarCedula(cedula: string) {
  return /^[0-9]{5,20}$/.test(cedula);
}

// GET: Obtener un usuario por cédula
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cedula: string }> }
) {
  const { cedula } = await params;

  if (!cedula || !validarCedula(cedula)) {
    return NextResponse.json({ error: 'Cédula inválida o no proporcionada' }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { cedula },
      include: { roles: true },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ usuario });
  } catch (error) {
    console.error('Error buscando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT: Actualizar usuario por cédula
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ cedula: string }> }
) {
  const { cedula } = await params;
  console.log(params)

  if (!cedula || !validarCedula(cedula)) {
    return NextResponse.json({ error: 'Cédula inválida' }, { status: 400 });
  }

  try {
    const body = await req.json();

    // Si viene nueva contraseña, encriptarla
    if (body.contrasena) {
      body.contrasena = await bcrypt.hash(body.contrasena, 10);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { cedula },
      data: body,
      include: { roles: true },
    });

    return NextResponse.json({ mensaje: 'Usuario actualizado', usuario: usuarioActualizado });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

// DELETE: Eliminar usuario por cédula
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ cedula: string }> }
) {
  console.log(params);
  const { cedula } = await params;

  if (!cedula || !validarCedula(cedula)) {
    return NextResponse.json({ error: 'Cédula inválida' }, { status: 400 });
  }

  try {
    await prisma.usuario.delete({
      where: { cedula },
    });

    return NextResponse.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
