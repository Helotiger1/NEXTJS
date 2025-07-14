import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import {
  validarAlmacenCompleto,
  validarAlmacenUnico,
} from "@lib/Validaciones_Almacenes";

// POST - Crear nuevo almacén con datos planos
export async function POST(req: NextRequest) {
  try {
    
    // Recibir datos planos del cuerpo de la solicitud
    const requestData = await req.json();

    // Desempaquetar datos planos a estructura esperada
    const datosTransformados = {
      telefono: requestData.telefono,
      direccion: {
        linea1: requestData.linea1,
        linea2: requestData.linea2 || "", // Opcional
        pais: requestData.pais,
        estado: requestData.estado,
        ciudad: requestData.ciudad,
        codigoPostal: requestData.codigoPostal,
      },
    };

    // Convertir código postal a número
    if (datosTransformados.direccion.codigoPostal) {
      datosTransformados.direccion.codigoPostal = parseInt(
        datosTransformados.direccion.codigoPostal
      );
      if (isNaN(datosTransformados.direccion.codigoPostal)) {
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

    // Validación de campos requeridos
    const erroresValidacion = validarAlmacenCompleto(datosTransformados);
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

    // Validar unicidad
    const erroresUnicidad = await validarAlmacenUnico(datosTransformados);
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

    // Crear en transacción
    const almacen = await prisma.$transaction(async (tx) => {
      const nuevaDireccion = await tx.direccion.create({
        data: {
          linea1: datosTransformados.direccion.linea1,
          linea2: datosTransformados.direccion.linea2,
          pais: datosTransformados.direccion.pais,
          estado: datosTransformados.direccion.estado,
          ciudad: datosTransformados.direccion.ciudad,
          codigoPostal: datosTransformados.direccion.codigoPostal,
        },
      });

      return await tx.almacen.create({
        data: {
          telefono: datosTransformados.telefono.toString(),
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

    return NextResponse.json(almacenes)
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
