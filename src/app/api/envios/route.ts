import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { calcularCostoEnvio } from "@/app/lib/Logica_Negocio"; // Asegúrate de que esta función esté definida correctamente

const prisma = new PrismaClient();

// Tipos para TypeScript
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

// GET: Obtener envíos con paginación y filtros
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Paginación
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Filtros
    const estado = searchParams.get("estado");
    const tipo = searchParams.get("tipo");
    const desde = searchParams.get("desde");
    const hasta = searchParams.get("hasta");
    const almacenOrigen = searchParams.get("almacenOrigen");
    const almacenDestino = searchParams.get("almacenDestino");

    const where: Prisma.EnvioWhereInput = {};

    if (estado) where.estado = estado.toLowerCase();
    if (tipo) where.tipo = tipo.toLowerCase();
    if (almacenOrigen) where.almacenOrigen = Number(almacenOrigen);
    if (almacenDestino) where.almacenEnvio = Number(almacenDestino);
    
    if (desde || hasta) {
      where.fechaSalida = {};
      if (desde) where.fechaSalida.gte = new Date(desde);
      if (hasta) where.fechaSalida.lte = new Date(hasta);
    }

    const [envios, total] = await Promise.all([
      prisma.envio.findMany({
        where,
        include: {
          Origen: true,
          Envio: true,
          detalleEnvio: {
            include: { 
              paquete: { 
                include: { 
                  medidas: true,
                  destino: true,
                  origen: true
                } 
              } 
            },
          },
          facturas: {
            include: {
              cliente: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { fechaSalida: "desc" },
      }),
      prisma.envio.count({ where }),
    ]);

    return NextResponse.json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: envios,
    });
  } catch (error) {
    console.error("Error obteniendo envíos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
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