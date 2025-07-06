import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import {
  validarTelefono,
} from "@/app/lib/Validaciones_Almacenes";

const prisma = new PrismaClient();

// POST /api/almacenes - crear un nuevo almacén
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validar telefono
    const errorTelefono = validarTelefono(data.telefono);
    if (errorTelefono) {
      return NextResponse.json({ error: errorTelefono }, { status: 400 });
    }

    // Validar que direccionId exista
    if (!data.direccionId || typeof data.direccionId !== 'number') {
      return NextResponse.json({ error: "direccionId es obligatorio y debe ser un número" }, { status: 400 });
    }

    const direccionExistente = await prisma.direccion.findUnique({
      where: { id: data.direccionId }
    });

    if (!direccionExistente) {
      return NextResponse.json({ error: "La dirección indicada no existe" }, { status: 400 });
    }

    // Crear almacén apuntando a dirección existente
    const nuevoAlmacen = await prisma.almacen.create({
      data: {
        telefono: data.telefono,
        direccionId: data.direccionId,
      },
      include: { direccion: true },
    });

    return NextResponse.json(nuevoAlmacen, { status: 201 });

  } catch (error) {
    console.error("ERROR POST /api/almacenes →", error);
    return NextResponse.json({ error: "Error al crear almacén" }, { status: 500 });
  }
}

// GET /api/almacenes - listar todos los almacenes
export async function GET() {
  try {
    const almacenes = await prisma.almacen.findMany({
      include: { direccion: true },
    });
    return NextResponse.json(almacenes);
  } catch (error) {
    console.error("ERROR GET /api/almacenes →", error);
    return NextResponse.json(
      { error: "Error al obtener almacenes" },
      { status: 500 }
    );
  }
}