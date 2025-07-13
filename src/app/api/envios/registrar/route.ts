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

interface EnvioBody {
  tipo: string;
  estado: string;
  fechaSalida: string;
  fechaLlegada: string;
  almacenOrigen: number;
  almacenEnvio: number;
  paquetes: number[];
  clienteCedula: string; // Ahora lo recibimos en el body
}

interface UpdateEnvioBody {
  estado?: string;
  fechaLlegada?: string;
}

// Validaciones (actualizadas para coincidir con tus enums)
function validarTipoEnvio(tipo: string): string | null {
  const tiposValidos = ["barco", "avion"];
  if (!tiposValidos.includes(tipo.toLowerCase())) {
    return `Tipo de envío inválido. Debe ser: ${tiposValidos.join(", ")}`;
  }
  return null;
}

function validarEstadoEnvio(estado: string): string | null {
  const estadosValidos = ["en puerto de salida", "en transito", "en destino"];
  if (!estadosValidos.includes(estado.toLowerCase())) {
    return `Estado inválido. Debe ser: ${estadosValidos.join(", ")}`;
  }
  return null;
}

function validarFecha(fecha: string, campo: string): string | null {
  if (isNaN(Date.parse(fecha))) {
    return `Fecha ${campo} inválida`;
  }
  return null;
}

// POST: Crear nuevo envío
export async function POST(req: NextRequest) {
  try {
    const body: EnvioBody = await req.json();

    // Validaciones básicas
    const errores = [
      validarTipoEnvio(body.tipo),
      validarEstadoEnvio(body.estado),
      validarFecha(body.fechaSalida, "fechaSalida"),
      validarFecha(body.fechaLlegada, "fechaLlegada"),
    ].filter(Boolean);

    if (errores.length > 0) {
      return NextResponse.json({ errors: errores }, { status: 400 });
    }

    // Validar fechas coherentes
    if (new Date(body.fechaLlegada) < new Date(body.fechaSalida)) {
      return NextResponse.json(
        { error: "La fecha de llegada no puede ser anterior a la fecha de salida" },
        { status: 400 }
      );
    }

    // Validar almacenes
    const [origen, destino] = await Promise.all([
      prisma.almacen.findUnique({ where: { codigo: body.almacenOrigen } }),
      prisma.almacen.findUnique({ where: { codigo: body.almacenEnvio } }),
    ]);

    if (!origen || !destino) {
      return NextResponse.json(
        { error: "Almacén de origen o destino no encontrado" },
        { status: 404 }
      );
    }

    // Validar paquetes
    if (!Array.isArray(body.paquetes) || body.paquetes.length === 0) {
      return NextResponse.json(
        { error: "Debe incluir al menos un paquete" },
        { status: 400 }
      );
    }

    const paquetesExistentes = await prisma.paquete.findMany({
      where: { tracking: { in: body.paquetes } },
      include: { medidas: true }
    });

    if (paquetesExistentes.length !== body.paquetes.length) {
      return NextResponse.json(
        { error: "Algunos paquetes no existen" },
        { status: 404 }
      );
    }

    // Validar que el cliente existe
    const cliente = await prisma.usuario.findUnique({
      where: { cedula: body.clienteCedula }
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Crear envío en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // 1. Crear el envío
      const nuevoEnvio = await tx.envio.create({
        data: {
          tipo: body.tipo.toLowerCase(),
          estado: body.estado.toLowerCase(),
          fechaSalida: new Date(body.fechaSalida),
          fechaLlegada: new Date(body.fechaLlegada),
          almacenOrigen: body.almacenOrigen,
          almacenEnvio: body.almacenEnvio,
          detalleEnvio: {
            create: body.paquetes.map(tracking => ({ paqueteTracking: tracking })),
          },
        },
        include: {
          detalleEnvio: {
            include: { paquete: true },
          },
        },
      });

      // 2. Actualizar estado de los paquetes
      await tx.paquete.updateMany({
        where: { tracking: { in: body.paquetes } },
        data: { estado: "EN_TRANSITO" },
      });

      // 3. Calcular costos y crear factura
      const detallesFactura = await Promise.all(
        paquetesExistentes.map(async (paquete) => {
          const costo = calcularCostoEnvio(paquete, body.tipo as 'barco' | 'avion');
          return {
            paqueteTracking: paquete.tracking,
            monto: costo
          };
        })
      );

      const montoTotal = detallesFactura.reduce((sum, detalle) => sum + detalle.monto, 0);

      await tx.factura.create({
        data: {
          estado: "GENERADO",
          monto: montoTotal,
          metodoPago: "PENDIENTE",
          cantPiezas: body.paquetes.length,
          envioNumero: nuevoEnvio.numero,
          clienteCedula: body.clienteCedula,
          detalleFactura: {
            create: detallesFactura
          }
        }
      });

      return nuevoEnvio;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creando envío:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar envío
export async function PATCH(req: NextRequest) {
  try {
    const { numero, ...data }: { numero: number } & UpdateEnvioBody = await req.json();

    // Validar que el envío existe
    const envioExistente = await prisma.envio.findUnique({
      where: { numero },
      include: { detalleEnvio: true },
    });

    if (!envioExistente) {
      return NextResponse.json(
        { error: "Envío no encontrado" },
        { status: 404 }
      );
    }

    // Validar datos a actualizar
    if (data.estado) {
      const error = validarEstadoEnvio(data.estado);
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }
    }

    if (data.fechaLlegada) {
      const error = validarFecha(data.fechaLlegada, "fechaLlegada");
      if (error) {
        return NextResponse.json({ error }, { status: 400 });
      }
    }

    // Actualizar envío
    const envioActualizado = await prisma.envio.update({
      where: { numero },
      data: {
        estado: data.estado?.toLowerCase(),
        fechaLlegada: data.fechaLlegada ? new Date(data.fechaLlegada) : undefined,
      },
    });

    // Si el estado cambió a "en destino", actualizar paquetes
    if (data.estado?.toLowerCase() === "en destino") {
      const paquetesIds = envioExistente.detalleEnvio.map(d => d.paqueteTracking);
      await prisma.paquete.updateMany({
        where: { tracking: { in: paquetesIds } },
        data: { estado: "EN_ALMACEN" },
      });
    }

    return NextResponse.json(envioActualizado);
  } catch (error) {
    console.error("Error actualizando envío:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET: Listar paquetes con paginación y filtros
export async function GET(req: NextRequest) {
  try {
        //En vista de que se rompio, procedere a meter cualquier mamada aqui.
    return NextResponse.json( [
  {
    tracking: "123456789",
    descripcion: "Paquete de documentos importantes",
    origen: "California",
    destino: "Doral",
    peso: "2 kg",
    alto: "10 cm",
    largo: "30 cm",
    volumen: "0.003 m³",
    fecha: "2025-07-10",
    cedulaOrigen: 3141414,
    cedulaDestino : 4314144
  },
  {
    tracking: "987654321",
    descripcion: "Componentes electrónicos",
    origen: "Shanghai, China",
    destino: "Caracas, Venezuela",
    peso: "15 kg",
    alto: "40 cm",
    largo: "60 cm",
    volumen: "0.096 m³",
    fecha: "2025-07-08",
  },
  {
    tracking: "112233445",
    descripcion: "Muestra de tela",
    origen: "Madrid, España",
    destino: "Maracaibo, Venezuela",
    peso: "0.5 kg",
    alto: "5 cm",
    largo: "20 cm",
    volumen: "0.001 m³",
    fecha: "2025-07-11",
  },
  {
    tracking: "556677889",
    descripcion: "Libros y material de estudio",
    origen: "Bogotá, Colombia",
    destino: "Valencia, Venezuela",
    peso: "8 kg",
    alto: "25 cm",
    largo: "45 cm",
    volumen: "0.028 m³",
    fecha: "2025-07-09",
  },
]);
    const { searchParams } = new URL(req.url);

    // Filtros
    const estado = searchParams.get("estado");
    const empleadoId = searchParams.get("empleadoId");
    const almacenCodigo = searchParams.get("almacenCodigo");
    const clienteOrigenId = searchParams.get("clienteOrigenId");
    const clienteDestinoId = searchParams.get("clienteDestinoId");
    const tracking = searchParams.get("tracking");

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
    const clienteId = searchParams.get("clienteId");
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

    return NextResponse.json({
      success: true,
      data: paquetesEnriquecidos,
    });
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
