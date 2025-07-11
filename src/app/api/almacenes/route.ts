import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import {
  validarTelefono,
} from "@/app/lib/Validaciones_Almacenes";
import { DireccionInput } from "@/app/lib/Validaciones_Direcciones";

const prisma = new PrismaClient();

// POST /api/almacenes - crear un nuevo almacén
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log( body)
    const { telefono, direccion } = body;

    // Validar teléfono
    const errorTelefono = validarTelefono(telefono);
    if (errorTelefono) {
      return NextResponse.json({ error: errorTelefono }, { status: 400 });
    }

    if (typeof direccion.codigoPostal !== 'number') {
  const convertido = Number(direccion.codigoPostal);

  if (isNaN(convertido)) {
    throw new Error("El código postal debe ser un número válido.");
  }

  direccion.codigoPostal = convertido;
}
    // Validar datos mínimos de dirección
    if (!direccion || typeof direccion !== "object") {
      return NextResponse.json({ error: "Dirección inválida o ausente" }, { status: 400 });
    }

    // Crear dirección primero
    const nuevaDireccion = await prisma.direccion.create({
      data: direccion,
    });

    // Crear almacén apuntando a la dirección creada
    const nuevoAlmacen = await prisma.almacen.create({
      data: {
        telefono,
        direccionId: nuevaDireccion.id,
      },
      include: {
        direccion: true,
      },
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