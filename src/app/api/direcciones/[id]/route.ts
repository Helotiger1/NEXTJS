import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validarDireccion, DireccionInput } from '@/app/lib/Validaciones_Direcciones';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const direccion = await prisma.direccion.findUnique({
      where: { id },
    });

    if (!direccion) {
      return NextResponse.json({ error: 'Dirección no encontrada' }, { status: 404 });
    }

    return NextResponse.json(direccion);
  } catch (error) {
    console.error('Error obteniendo dirección:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const data = await req.json();

    const error = validarDireccion(data as DireccionInput);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const direccionExistente = await prisma.direccion.findUnique({ where: { id } });
    if (!direccionExistente) {
      return NextResponse.json({ error: 'Dirección no encontrada' }, { status: 404 });
    }

    const direccionActualizada = await prisma.direccion.update({
      where: { id },
      data,
    });

    return NextResponse.json(direccionActualizada);
  } catch (error) {
    console.error('Error actualizando dirección:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const direccionExistente = await prisma.direccion.findUnique({ where: { id } });
    if (!direccionExistente) {
      return NextResponse.json({ error: 'Dirección no encontrada' }, { status: 404 });
    }

    await prisma.direccion.delete({ where: { id } });

    return NextResponse.json({ mensaje: 'Dirección eliminada correctamente' });
  } catch (error) {
    console.error('Error eliminando dirección:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
