import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
  EstadoPaquete,
  validarMedidas,
  validarEstadoPaqueteString,
  validarTextoNoVacio,
} from "@/app/lib/Validaciones_Paquetes";
import { Prisma } from "@prisma/client";

// POST: Crear nuevo paquete
export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('userId');
    console.log(userId);
    const body = await req.json();
    console.log("Datos recibidos:", body);


    const {
      descripcion,
      estado = "REGISTRADO",
      origenId,
      destinoId,
      clienteOrigenId,
      clienteDestinoId,
      medidas = {},
      tipoEnvio,
    } = body;

    const empleadoId = userId ? parseInt(userId, 10) : null; //user id tiene el id del empleado que está haciendo la petición

    const almacenCodigo = origenId;

    const { 
      largo = "0", 
      ancho = "0", 
      alto = "0", 
      peso = "0" 
    } = medidas;

    const medidasNumericas = {
      largo: Number(largo),
      ancho: Number(ancho),
      alto: Number(alto),
      peso: Number(peso),
    };

    if (Object.values(medidasNumericas).some(isNaN)) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Todas las medidas deben ser valores numéricos válidos",
          details: { medidasRecibidas: medidas, medidasConvertidas: medidasNumericas }
        },
        { status: 400 }
      );
    }

    const processedData = {
      descripcion,
      estado,
      almacenCodigo: Number(almacenCodigo),
      empleadoId: empleadoId ?? undefined,
      origenId: Number(origenId),
      destinoId: Number(destinoId),
      clienteOrigenId: Number(clienteOrigenId),
      clienteDestinoId: Number(clienteDestinoId),
    };

    const errors: Record<string, string> = {};

    const descError = validarTextoNoVacio(descripcion, "Descripción", { maxLength: 500 });
    if (descError) errors.descripcion = descError;

    if (estado && !validarEstadoPaqueteString(estado)) {
      errors.estado = "Estado de paquete inválido";
    }

    if (!["BARCO", "AVION"].includes(tipoEnvio)) {
      errors.tipoEnvio = "Tipo de envío inválido. Debe ser 'BARCO' o 'AVION'";
    }

    ["origenId", "destinoId", "clienteOrigenId", "clienteDestinoId"].forEach(field => {
      if (isNaN(processedData[field as keyof typeof processedData])) {
        errors[field] = `${field} debe ser un número válido`;
      }
    });

    const medidasError = validarMedidas(medidasNumericas);
    if (medidasError) errors.medidas = medidasError;

    if (processedData.origenId === processedData.destinoId) {
      errors.origenId = "El almacén origen y destino no pueden ser el mismo";
    }

    if (processedData.clienteOrigenId === processedData.clienteDestinoId) {
      errors.clienteOrigenId = "El cliente origen y destino no pueden ser el mismo";
    }

    if (estado !== "REGISTRADO") {
      errors.estado = "El estado inicial debe ser REGISTRADO";
    }


    console.log(errors);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    console.log("aun 1")

    const [almacen, empleado, origen, destino, clienteOrigen, clienteDestino] = await Promise.all([
      prisma.almacen.findUnique({ where: { codigo: processedData.almacenCodigo } }),
      prisma.usuario.findUnique({ where: { id: empleadoId ?? undefined }, include: { roles: true } }),
      prisma.almacen.findUnique({ where: { codigo: processedData.origenId } }),
      prisma.almacen.findUnique({ where: { codigo: processedData.destinoId } }),
      prisma.usuario.findUnique({ where: { id: processedData.clienteOrigenId }, include: { roles: true } }),
      prisma.usuario.findUnique({ where: { id: processedData.clienteDestinoId }, include: { roles: true } }),
    ]);
     console.log("aun 2")

    if (!almacen) errors.almacenCodigo = "Almacén no encontrado";
    if (!empleado) errors.empleadoId = "Empleado no encontrado";
    if (!origen) errors.origenId = "Almacén origen no encontrado";
    if (!destino) errors.destinoId = "Almacén destino no encontrado";
    if (!clienteOrigen) errors.clienteOrigenId = "Cliente origen no encontrado";
    if (!clienteDestino) errors.clienteDestinoId = "Cliente destino no encontrado";
 console.log("aun 3")
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 404 });
    }

    const empleadoTienePermiso = empleado?.roles?.some(r => ["EMPLEADO", "ADMIN"].includes(r.rol.toUpperCase())) ?? false;
    if (!empleadoTienePermiso) {
      return NextResponse.json(
        { success: false, error: "El usuario no tiene permisos para registrar paquetes" },
        { status: 403 }
      );
    }

    const clienteOrigenEsCliente = clienteOrigen?.roles?.some(r => r.rol.toUpperCase() === "CLIENTE") ?? false;
    const clienteDestinoEsCliente = clienteDestino?.roles?.some(r => r.rol.toUpperCase() === "CLIENTE") ?? false;
    if (!clienteOrigenEsCliente || !clienteDestinoEsCliente) {
      return NextResponse.json(
        { success: false, error: "Los clientes deben tener el rol CLIENTE" },
        { status: 400 }
      );
    }

    const nuevoPaquete = await prisma.$transaction(async (tx) => {
      const medidasCreadas = await tx.medidas.create({
        data: {
          ...medidasNumericas,
          volumen: parseFloat(
            (medidasNumericas.largo * medidasNumericas.ancho * medidasNumericas.alto / 1728).toFixed(2)
          ),
        },
      });

      return await tx.paquete.create({
        data: {
          descripcion: descripcion.trim(),
          estado: "REGISTRADO",
          almacenCodigo: processedData.almacenCodigo,
          empleadoId,
          origenId: processedData.origenId,
          destinoId: processedData.destinoId,
          clienteOrigenId: processedData.clienteOrigenId,
          clienteDestinoId: processedData.clienteDestinoId,
          medidasId: medidasCreadas.id,
          tipoEnvio: tipoEnvio,
        },
        include: {
          almacen: true,
          empleado: { select: { nombre: true, apellido: true, cedula: true } },
          origen: true,
          destino: true,
          medidas: true,
          clienteOrigen: { select: { nombre: true, apellido: true, cedula: true } },
          clienteDestino: { select: { nombre: true, apellido: true, cedula: true } },
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
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
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
    else orderBy.tracking = "asc";

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

    // 4. Filtro por estado de factura
    const estadoFactura = searchParams.get("estadoFactura");
    if (estadoFactura) {
      where.detalleFactura = {
        factura: {
          estado: estadoFactura,
        },
      };
    }

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
              fechaSalida: "asc",
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
      //orderBy,
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
