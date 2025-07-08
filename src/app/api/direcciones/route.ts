// src/app/api/direcciones/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { validarDireccion, DireccionInput } from '@/app/lib/Validaciones_Direcciones';

const prisma = new PrismaClient();

// POST /api/direcciones - crear dirección
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log(data)
    // Validar datos
    const error = validarDireccion(data as DireccionInput);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Crear dirección en la BD
    const nuevaDireccion = await prisma.direccion.create({
      data,
    });

    return NextResponse.json(nuevaDireccion, { status: 201 });

  } catch (error) {
    console.error('Error creando dirección:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET /api/direcciones - listar todas las direcciones
export async function GET() {
  try {
    const direcciones = await prisma.direccion.findMany();
    return NextResponse.json(direcciones);
  } catch (error) {
    console.error('Error obteniendo direcciones:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
