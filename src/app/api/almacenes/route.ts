import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import {
  validarAlmacenCompleto,
  validarAlmacenUnico,
} from "@lib/Validaciones_Almacenes";

// POST - Crear nuevo almacén
export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();

    // Convertir código postal a número si es necesario
    if (requestData.direccion?.codigoPostal) {
      requestData.direccion.codigoPostal = parseInt(
        requestData.direccion.codigoPostal
      );
      if (isNaN(requestData.direccion.codigoPostal)) {
        return NextResponse.json(
          {
            success: false,
            error: "Datos inválidos",
            details: ["El código postal debe ser un número válido"],
          },
          { status: 400 }
        );
      }
    }

    // 1. Validación básica de campos requeridos
    const erroresValidacion = validarAlmacenCompleto(requestData);
    if (erroresValidacion.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
          details: erroresValidacion,
        },
        { status: 400 }
      );
    }

    const { telefono, direccion } = requestData;

    // 2. Validar unicidad (almacén no duplicado)
    const erroresUnicidad = await validarAlmacenUnico({ telefono, direccion });
    if (erroresUnicidad.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Conflicto de datos",
          details: erroresUnicidad,
        },
        { status: 409 }
      );
    }

    // 3. Crear en transacción
    const almacen = await prisma.$transaction(async (tx) => {
      const nuevaDireccion = await tx.direccion.create({
        data: {
          linea1: direccion.linea1!,
          linea2: direccion.linea2 || "",
          pais: direccion.pais!,
          estado: direccion.estado!,
          ciudad: direccion.ciudad!,
          codigoPostal: direccion.codigoPostal,
        },
      });

      return await tx.almacen.create({
        data: {
          telefono: telefono.toString(),
          direccionId: nuevaDireccion.id,
        },
        include: { direccion: true },
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: almacen,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear almacén:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

// GET - Listar todos los almacenes
export async function GET() {
  try {
    const almacenes = await prisma.almacen.findMany({
      include: {
        direccion: true,
        _count: {
          select: {
            paquetes: true,
            origenEnvios: true,
            destinoEnvios: true,
          },
        },
      },
      orderBy: {
        codigo: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: almacenes,
      count: almacenes.length,
    });
  } catch (error) {
    console.error("Error al obtener almacenes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
