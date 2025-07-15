import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";


function validarNumeroPositivoQueryParam(value: string | null, paramName: string): { error: string } | null {
  if (value === null) return null; 
  const num = Number(value);
  if (isNaN(num) || num <= 0) {
    return { error: `El parámetro '${paramName}' debe ser un número positivo válido.` };
  }
  return null;
}

function validarFechaQueryParam(value: string | null, paramName: string): { error: string } | null {
  if (value === null) return null;
  if (isNaN(Date.parse(value))) {
    return { error: `El parámetro '${paramName}' debe ser una fecha válida (YYYY-MM-DD o formato ISO).` };
  }
  return null;
}

function validarTipoEnvioQueryParam(tipo: string | null): { error: string } | null {
  if (tipo === null) return null;
  const tiposValidos = ["barco", "avion"];
  if (!tiposValidos.includes(tipo.toLowerCase())) {
    return { error: `El parámetro 'tipo' tiene un valor inválido. Debe ser: ${tiposValidos.join(", ")}.` };
  }
  return null;
}

function validarEstadoEnvioQueryParam(estado: string | null): { error: string } | null {
  if (estado === null) return null;
  const estadosValidos = ["en puerto de salida", "en transito", "en destino"];
  if (!estadosValidos.includes(estado.toLowerCase())) {
    return { error: `El parámetro 'estado' tiene un valor inválido. Debe ser: ${estadosValidos.join(", ")}.` };
  }
  return null;
}



// GET: Obtener envíos con paginación y filtros
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const erroresValidacion: string[] = [];

    // Paginación
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");

    const pageError = validarNumeroPositivoQueryParam(pageParam, "page");
    if (pageError) erroresValidacion.push(pageError.error);
    const limitError = validarNumeroPositivoQueryParam(limitParam, "limit");
    if (limitError) erroresValidacion.push(limitError.error);

    const page = Number(pageParam) || 1;
    const limit = Number(limitParam) || 10;
    const skip = (page - 1) * limit;

    // Filtros
    const estado = searchParams.get("estado");
    const tipo = searchParams.get("tipo");
    const desde = searchParams.get("desde"); // Fecha de salida (gte)
    const hasta = searchParams.get("hasta"); // Fecha de salida (lte)
    const almacenOrigen = searchParams.get("almacenOrigen");
    const almacenDestino = searchParams.get("almacenDestino");
    const empleadoCedula = searchParams.get("empleadoCedula"); // Filtro por empleado

    // Validaciones para IDs numéricos
    const idParams = { almacenOrigen, almacenDestino, empleadoCedula };
    for (const [key, value] of Object.entries(idParams)) {
      const error = validarNumeroPositivoQueryParam(value, key);
      if (error) erroresValidacion.push(error.error);
    }

    // Validaciones para fechas
    const desdeError = validarFechaQueryParam(desde, "desde");
    if (desdeError) erroresValidacion.push(desdeError.error);
    const hastaError = validarFechaQueryParam(hasta, "hasta");
    if (hastaError) erroresValidacion.push(hastaError.error);

    // Validaciones para tipo y estado
    const tipoError = validarTipoEnvioQueryParam(tipo);
    if (tipoError) erroresValidacion.push(tipoError.error);
    const estadoError = validarEstadoEnvioQueryParam(estado);
    if (estadoError) erroresValidacion.push(estadoError.error);

    // Si hay errores de validación, devolverlos
    if (erroresValidacion.length > 0) {
      return NextResponse.json({ success: false, errors: erroresValidacion }, { status: 400 });
    }
   

    const where: Prisma.EnvioWhereInput = {};

    if (estado) where.estado = estado.toLowerCase();
    if (tipo) where.tipo = tipo.toLowerCase();
    if (almacenOrigen) where.almacenOrigen = Number(almacenOrigen);
    if (almacenDestino) where.almacenEnvio = Number(almacenDestino);
    if (empleadoCedula) where.empleadoCedula = Number(empleadoCedula);


    if (desde || hasta) {
      where.fechaSalida = {};
      if (desde) where.fechaSalida.gte = new Date(desde);
      if (hasta) where.fechaSalida.lte = new Date(hasta);
    }

    // Obtener envíos y el total para paginación
    const [envios, totalEnvios] = await Promise.all([
      prisma.envio.findMany({
        where,
        include: {
          Origen: true, // Incluye el almacén de origen
          Envio: true,  // Incluye el almacén de destino
          empleado: {   // Incluye el empleado que realizó el envío
            select: {
              id: true,
              cedula: true,
              nombre: true,
              apellido: true,
              email: true,
              telefono: true,
              roles: { select: { rol: true } },
            },
          },
          detalleEnvio: { // Incluye los paquetes asociados a través de DetalleEnvio
            include: {
              paquete: {
                include: {
                  medidas: true,
                  origen: true,
                  destino: true,
                },
              },
            },
          },
          facturas: { // Incluye las facturas asociadas
            include: {
              cliente: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { fechaSalida: "desc" },
      }),
      prisma.envio.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: envios,
      pagination: {
        totalItems: totalEnvios,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalEnvios / limit),
      },
    });
  } catch (error: unknown) { // Manejo de errores con tipo 'unknown'
    console.error("Error obteniendo envíos:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor al obtener envíos",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message // Mostrar detalles del error en desarrollo
            : undefined,
      },
      { status: 500 }
    );
  }
}