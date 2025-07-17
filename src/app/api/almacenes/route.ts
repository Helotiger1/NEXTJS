import { NextRequest, NextResponse } from "next/server";
import prisma from "@lib/prisma";
import {
  validarAlmacenCompleto,
  validarAlmacenUnico,
} from "@lib/Validaciones_Almacenes";

// POST - Crear nuevo almacén con datos planos
export async function POST(req: NextRequest) {
  try {
    console.log('[ALMACEN-POST] Iniciando creación de almacén');
    
    // Recibir datos planos del cuerpo de la solicitud
    const requestData = await req.json();
    console.log('[ALMACEN-POST] Datos recibidos del frontend:', JSON.stringify(requestData, null, 2));

    // Desempaquetar datos planos a estructura esperada
    const datosTransformados = {
      telefono: requestData.telefono,
      direccion: {
        linea1: requestData.direccion.linea1,
        linea2: requestData.direccion.linea2 || "",
        pais: requestData.direccion.pais,
        estado: requestData.direccion.estado,
        ciudad: requestData.direccion.ciudad,
        codigoPostal: requestData.direccion.codigoPostal,
      },
    };
    console.log('[ALMACEN-POST] Datos transformados:', JSON.stringify(datosTransformados, null, 2));

    // Convertir código postal a número
    if (datosTransformados.direccion.codigoPostal) {
      console.log('[ALMACEN-POST] Convirtiendo código postal:', datosTransformados.direccion.codigoPostal);
      datosTransformados.direccion.codigoPostal = parseInt(
        datosTransformados.direccion.codigoPostal
      );
      if (isNaN(datosTransformados.direccion.codigoPostal)) {
        console.log('[ALMACEN-POST] Error: Código postal no es un número válido');
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
    console.log('[ALMACEN-POST] Validando campos requeridos');
    const erroresValidacion = validarAlmacenCompleto(datosTransformados);
    if (erroresValidacion.length > 0) {
      console.log('[ALMACEN-POST] Errores de validación:', erroresValidacion);
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
    console.log('[ALMACEN-POST] Validando unicidad de datos');
    const erroresUnicidad = await validarAlmacenUnico(datosTransformados);
    if (erroresUnicidad.length > 0) {
      console.log('[ALMACEN-POST] Conflictos de unicidad:', erroresUnicidad);
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
    console.log('[ALMACEN-POST] Iniciando transacción para crear almacén');
    const almacen = await prisma.$transaction(async (tx) => {
      console.log('[ALMACEN-POST] Creando dirección...');
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
      console.log('[ALMACEN-POST] Dirección creada con ID:', nuevaDireccion.id);

      console.log('[ALMACEN-POST] Creando almacén...');
      const nuevoAlmacen = await tx.almacen.create({
        data: {
          telefono: datosTransformados.telefono.toString(),
          direccionId: nuevaDireccion.id,
        },
        include: { direccion: true },
      });
      console.log('[ALMACEN-POST] Almacén creado con ID:', nuevoAlmacen.codigo);

      return nuevoAlmacen;
    });

    console.log('[ALMACEN-POST] Almacén creado exitosamente:', almacen);
    return NextResponse.json(
      {
        success: true,
        data: almacen,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[ALMACEN-POST] Error en el proceso:', error);
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
    console.log('[ALMACEN-GET] Obteniendo listado de almacenes');
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

    console.log('[ALMACEN-GET] Almacenes encontrados:', almacenes.length);
    return NextResponse.json(almacenes)
  } catch (error) {
    console.error('[ALMACEN-GET] Error al obtener almacenes:', error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}