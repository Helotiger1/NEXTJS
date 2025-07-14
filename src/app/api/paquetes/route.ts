import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
  EstadoPaquete,
  validarMedidas,
  validarEstadoPaqueteString,
  validarNumeroPositivo,
  validarTextoNoVacio,
} from "@/app/lib/Validaciones_Paquetes";
import { Prisma } from "@prisma/client";

// POST: Crear nuevo paquete
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Datos recibidos:", body);

    // Desempaquetar datos planos
    const {
      descripcion,
      estado = "REGISTRADO",
      almacenCodigo,
      empleadoId,
      origenId,
      destinoId,
      clienteOrigenId,
      clienteDestinoId,
      largo,
      ancho,
      alto,
      peso,
    } = body;

    // Convertir medidas a número
    const medidas = {
      largo: Number(largo),
      ancho: Number(ancho),
      alto: Number(alto),
      peso: Number(peso),
    };

    // Validar que sean números válidos
    if (
      [medidas.largo, medidas.ancho, medidas.alto, medidas.peso].some((v) =>
        isNaN(v)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Todas las medidas (largo, ancho, alto, peso) deben ser numéricas",
        },
        { status: 400 }
      );
    }

    // Validar campos numéricos requeridos
    const numericFields = [
      "almacenCodigo",
      "empleadoId",
      "origenId",
      "destinoId",
      "clienteOrigenId",
      "clienteDestinoId",
    ];

    const processedData = {
      descripcion,
      estado,
      almacenCodigo: Number(almacenCodigo),
      empleadoId: Number(empleadoId),
      origenId: Number(origenId),
      destinoId: Number(destinoId),
      clienteOrigenId: Number(clienteOrigenId),
      clienteDestinoId: Number(clienteDestinoId),
    };

    numericFields.forEach((field) => {
      const value = processedData[field as keyof typeof processedData];
      if (value === undefined || isNaN(value)) {
        throw new Error(`${field} debe ser un número válido`);
      }
    });

    const {
      descripcion: desc,
      estado: estadoFinal,
      almacenCodigo: almacenCod,
      empleadoId: empId,
      origenId: origId,
      destinoId: destId,
      clienteOrigenId: cliOrigId,
      clienteDestinoId: cliDestId,
    } = processedData;

    // Validaciones básicas
    const errors: Record<string, string> = {};

    const descError = validarTextoNoVacio(desc, "Descripción", {
      maxLength: 500,
    });
    if (descError) errors.descripcion = descError;

    if (estadoFinal && !validarEstadoPaqueteString(estadoFinal)) {
      errors.estado = "Estado de paquete inválido";
    }

    const numericValidations = [
      { field: "almacenCodigo", value: almacenCod, name: "Almacén" },
      { field: "empleadoId", value: empId, name: "Empleado" },
      { field: "origenId", value: origId, name: "Origen" },
      { field: "destinoId", value: destId, name: "Destino" },
      { field: "clienteOrigenId", value: cliOrigId, name: "Cliente Origen" },
      { field: "clienteDestinoId", value: cliDestId, name: "Cliente Destino" },
    ];

    numericValidations.forEach(({ field, value, name }) => {
      const error = validarNumeroPositivo(value, name, { entero: true });
      if (error) errors[field] = error;
    });

    const medidasError = validarMedidas(medidas);
    if (medidasError) {
      errors.medidas = medidasError;
    }

    if (Object.keys(errors).length > 0) {
      console.error("Errores de validación:", errors);
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Validaciones de negocio
    if (origId === destId) {
      return NextResponse.json(
        {
          success: false,
          error: "El almacén origen y destino no pueden ser el mismo",
        },
        { status: 400 }
      );
    }

    if (cliOrigId === cliDestId) {
      return NextResponse.json(
        {
          success: false,
          error: "El cliente origen y destino no pueden ser el mismo",
        },
        { status: 400 }
      );
    }

    if (estadoFinal && estadoFinal !== "REGISTRADO") {
      return NextResponse.json(
        { success: false, error: "El estado inicial debe ser REGISTRADO" },
        { status: 400 }
      );
    }

    // Verificar existencia de entidades relacionadas
    const [almacen, empleado, origen, destino, clienteOrigen, clienteDestino] =
      await Promise.all([
        prisma.almacen.findUnique({ where: { codigo: almacenCod } }),
        prisma.usuario.findUnique({
          where: { id: empId },
          include: { roles: true },
        }),
        prisma.almacen.findUnique({ where: { codigo: origId } }),
        prisma.almacen.findUnique({ where: { codigo: destId } }),
        prisma.usuario.findUnique({
          where: { id: cliOrigId },
          include: { roles: true },
        }),
        prisma.usuario.findUnique({
          where: { id: cliDestId },
          include: { roles: true },
        }),
      ]);

    if (!almacen) errors.almacenCodigo = "Almacén no encontrado";
    if (!empleado) errors.empleadoId = "Empleado no encontrado";
    if (!origen) errors.origenId = "Almacén origen no encontrado";
    if (!destino) errors.destinoId = "Almacén destino no encontrado";
    if (!clienteOrigen) errors.clienteOrigenId = "Cliente origen no encontrado";
    if (!clienteDestino)
      errors.clienteDestinoId = "Cliente destino no encontrado";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 404 });
    }

    const empleadoTienePermiso = empleado!.roles.some((r) =>
      ["EMPLEADO", "ADMIN"].includes(r.rol.toUpperCase())
    );

    if (!empleadoTienePermiso) {
      return NextResponse.json(
        {
          success: false,
          error: "El usuario no tiene permisos para registrar paquetes",
        },
        { status: 403 }
      );
    }

    const clienteOrigenEsCliente = clienteOrigen!.roles.some(
      (r) => r.rol.toUpperCase() === "CLIENTE"
    );
    const clienteDestinoEsCliente = clienteDestino!.roles.some(
      (r) => r.rol.toUpperCase() === "CLIENTE"
    );

    if (!clienteOrigenEsCliente || !clienteDestinoEsCliente) {
      return NextResponse.json(
        { success: false, error: "Los clientes deben tener el rol CLIENTE" },
        { status: 400 }
      );
    }

    // Crear paquete en transacción
    const nuevoPaquete = await prisma.$transaction(async (tx) => {
      const medidasCreadas = await tx.medidas.create({
        data: {
          largo: medidas.largo,
          ancho: medidas.ancho,
          alto: medidas.alto,
          peso: medidas.peso,
          volumen: (medidas.largo * medidas.ancho * medidas.alto) / 1728,
        },
      });

      return await tx.paquete.create({
        data: {
          descripcion: desc.trim(),
          estado: "REGISTRADO",
          almacenCodigo: almacenCod,
          empleadoId: empId,
          origenId: origId,
          destinoId: destId,
          clienteOrigenId: cliOrigId,
          clienteDestinoId: cliDestId,
          medidasId: medidasCreadas.id,
        },
        include: {
          almacen: true,
          empleado: { select: { nombre: true, apellido: true, cedula: true } },
          origen: true,
          destino: true,
          medidas: true,
          clienteOrigen: {
            select: { nombre: true, apellido: true, cedula: true },
          },
          clienteDestino: {
            select: { nombre: true, apellido: true, cedula: true },
          },
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...nuevoPaquete,
          links: {
            self: `/api/paquetes/${nuevoPaquete.tracking}`,
            estado: `/api/paquetes/${nuevoPaquete.tracking}/estado`,
          },
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error POST /api/paquetes:", error);

    let errorMessage = "Error interno del servidor";
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        errorMessage = "Violación de constraint única";
      } else if (error.code === "P2003") {
        errorMessage = "Referencia a clave foránea no encontrada";
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}


// GET: Listar paquetes con paginación y filtros
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Filtros
    const estado = searchParams.get("estado");
    const empleadoId = searchParams.get("empleadoId");
    const almacenCodigo = searchParams.get("almacenCodigo");
    const clienteOrigenId = searchParams.get("clienteOrigenId");
    const clienteDestinoId = searchParams.get("clienteDestinoId");
    const tracking = searchParams.get("tracking");
    const clienteId = searchParams.get("clienteId");

    // Ordenamiento (opcional)
    const sortField = searchParams.get("sort") || "tracking";
    const sortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";

    // Construir cláusula WHERE
    const where: Prisma.PaqueteWhereInput = {};

    if (estado && validarEstadoPaqueteString(estado)) {
      where.estado = estado as EstadoPaquete;
    }

    if (empleadoId && !isNaN(Number(empleadoId))) {
      where.empleadoId = Number(empleadoId);
    }

    if (almacenCodigo && !isNaN(Number(almacenCodigo))) {
      where.OR = [
        { almacenCodigo: Number(almacenCodigo) },
        { origenId: Number(almacenCodigo) },
        { destinoId: Number(almacenCodigo) },
      ];
    }
    
    if (clienteId && !isNaN(Number(clienteId))) {
      where.OR = [
        { clienteOrigenId: Number(clienteId) },
        { clienteDestinoId: Number(clienteId) },
      ];
    }

    if (clienteOrigenId && !isNaN(Number(clienteOrigenId))) {
      where.clienteOrigenId = Number(clienteOrigenId);
    }

    if (clienteDestinoId && !isNaN(Number(clienteDestinoId))) {
      where.clienteDestinoId = Number(clienteDestinoId);
    }

    if (tracking && !isNaN(Number(tracking))) {
      where.tracking = Number(tracking);
    }

    // Construir ORDER BY
    const orderBy: Prisma.PaqueteOrderByWithRelationInput = {};
    if (sortField === "tracking") orderBy.tracking = sortOrder;
    else if (sortField === "estado") orderBy.estado = sortOrder;
    else if (sortField === "almacenCodigo") orderBy.almacenCodigo = sortOrder;
    else orderBy.tracking = "desc";

    // 1. Filtro combinado cliente (origen o destino)
    if (clienteId && !isNaN(Number(clienteId))) {
      where.OR = [
        { clienteOrigenId: Number(clienteId) },
        { clienteDestinoId: Number(clienteId) },
      ];
    }

    /*/ 2. Filtro por fechas
    const fechaInicio = searchParams.get("fechaInicio");
    const fechaFin = searchParams.get("fechaFin");
    if (fechaInicio || fechaFin) {
      where.fechaRegistro = {};
      if (fechaInicio) where.fechaRegistro.gte = new Date(fechaInicio);
      if (fechaFin) where.fechaRegistro.lte = new Date(fechaFin);
    }*/

    // 3. Filtro por tipo de envío
    const tipoEnvio = searchParams.get("tipoEnvio");
    if (tipoEnvio) {
      where.detalleEnvio = {
        some: {
          envio: {
            tipo: tipoEnvio,
          },
        },
      };
    }

    /*/ 4. Filtro por estado de factura
    const estadoFactura = searchParams.get("estadoFactura");
    if (estadoFactura) {
      where.detalleFactura = {
        some: {
          factura: {
            estado: estadoFactura,
          },
        },
      };
    }*/

    // Obtener todos los paquetes con relaciones completas
    const paquetes = await prisma.paquete.findMany({
      where,
      include: {
        almacen: {
          include: {
            direccion: true,
          },
        },
        empleado: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            roles: {
              select: {
                rol: true,
              },
            },
          },
        },
        origen: {
          include: {
            direccion: true,
          },
        },
        destino: {
          include: {
            direccion: true,
          },
        },
        medidas: true,
        clienteOrigen: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        clienteDestino: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        detalleEnvio: {
          include: {
            envio: {
              include: {
                Origen: {
                  include: {
                    direccion: true,
                  },
                },
                Envio: {
                  include: {
                    direccion: true,
                  },
                },
                empleado: {
                  select: {
                    nombre: true,
                    apellido: true,
                  },
                },
              },
            },
          },
          orderBy: {
            envio: {
              fechaSalida: "desc",
            },
          },
        },
        detalleFactura: {
          include: {
            factura: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
      orderBy,
    });

    // Enriquecer los datos con información calculada
    const paquetesEnriquecidos = paquetes.map((paquete) => {
      // Calcular días en tránsito si aplica
      let diasTransito = null;
      let envioActual = null;

      if (paquete.detalleEnvio.length > 0) {
        envioActual = paquete.detalleEnvio[0].envio;

        if (envioActual?.fechaSalida) {
          const fechaSalida = new Date(envioActual.fechaSalida);
          diasTransito = Math.floor(
            (Date.now() - fechaSalida.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
      }

      // Calcular tarifa estimada
      let tarifaEstimada = null;
      if (envioActual) {
        const volumenPiesCubicos =
          (paquete.medidas.largo *
            paquete.medidas.ancho *
            paquete.medidas.alto) /
          1728;

        if (envioActual.tipo === "MARITIMO") {
          tarifaEstimada = Math.max(volumenPiesCubicos * 25, 35);
        } else if (envioActual.tipo === "AEREO") {
          const porPeso = paquete.medidas.peso * 7;
          const porVolumen = volumenPiesCubicos * 7;
          tarifaEstimada = Math.max(Math.max(porPeso, porVolumen), 45);
        }
      }

      return {
        ...paquete,
        diasTransito,
        tarifaEstimada,
      };
    });

    return NextResponse.json(
paquetesEnriquecidos
    );
  } catch (error: unknown) {
    console.error("Error GET /api/paquetes:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener paquetes",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}
