import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { convertirNumeros } from "@/app/lib/axios";
import { Prisma, EstadoPaquete } from "@prisma/client";
import { validarEstadoPaqueteString } from "@/app/lib/Validaciones_Paquetes";
import {
  calcularPrecioEnvio,
  calcularPieCubico,
  generarFactura,
} from "@lib/Logica_Negocio";

// POST: Registrar un nuevo envío
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const paquetes = body.paquetes;
const bodyConvertido = convertirNumeros(body);
const { tipo, almacenOrigen, almacenEnvio } = bodyConvertido;

const todosCoinciden = paquetes.every(
  (paquete: any) => paquete.tipoEnvio === tipo
);

if (!todosCoinciden) {
  return NextResponse.json(
    {
      success: false,
      error: "Todos los paquetes deben tener el mismo tipo de envío que el especificado.",
    },
    { status: 400 }
  );
}
    const userId = req.headers.get("userId");
    const empleadoCedula = userId ? Number(userId) : null;
    const estado = "EN_TRANSITO";
    function formatearFechaLocal(fecha: Date): string {
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, "0");
      const dd = String(fecha.getDate()).padStart(2, "0");
      return `${yyyy}/${mm}/${dd}`;
    }

    const fechaSalida = formatearFechaLocal(new Date());
    const fechaLlegada = formatearFechaLocal(new Date(new Date().setDate(new Date().getDate() + 3)));

    if (!["BARCO", "AVION"].includes(tipo)) {
      return NextResponse.json(
        { success: false, error: "Tipo de envío inválido" },
        { status: 400 }
      );
    }

    if (almacenOrigen === almacenEnvio) {
      return NextResponse.json(
        {
          success: false,
          error: "El almacén origen y destino no pueden ser iguales",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(paquetes) || paquetes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Debe seleccionar al menos un paquete",
        },
        { status: 400 }
      );
    }

    // Validar existencia de almacenes y empleado
    const [origen, destino, empleado] = await Promise.all([
      prisma.almacen.findUnique({ where: { codigo: almacenOrigen } }),
      prisma.almacen.findUnique({ where: { codigo: almacenEnvio } }),
      prisma.usuario.findUnique({ where: { id: empleadoCedula ?? undefined } }),
    ]);

    if (!origen || !destino || !empleado) {
      return NextResponse.json(
        { success: false, error: "Almacén o empleado no encontrado" },
        { status: 404 }
      );
    }

    // Validar estados de paquetes
    const trackings = paquetes.map((p: any) => p.tracking);
    const paquetesDB = await prisma.paquete.findMany({
      where: { tracking: { in: trackings } },
      select: {
        tracking: true,
        estado: true,
        clienteOrigenId: true,
        tipoEnvio: true,
        medidas: {
          select: { largo: true, ancho: true, alto: true, peso: true },
        },
      },
    });

    const paquetesInvalidos = paquetesDB.filter(
      (p) => p.estado !== "REGISTRADO"
    );

    if (paquetesInvalidos.length > 0) {
      const detalles = paquetesInvalidos.map(
        (p) => `📦 ${p.tracking} → estado: ${p.estado}`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Uno o más paquetes no están disponibles para enviar",
          detalles,
        },
        { status: 400 }
      );
    }

    // Crear el envío
    const nuevoEnvio = await prisma.envio.create({
      data: {
        tipo,
        estado,
        fechaSalida,
        fechaLlegada,
        almacenOrigen,
        almacenEnvio,
        empleadoCedula,
        detalleEnvio: {
          create: paquetes.map((obj: any) => ({
            paquete: { connect: { tracking: obj.tracking } },
          })),
        },
      },
      include: {
        detalleEnvio: true,
      },
    });

    // Actualizar estado paquetes a EN_TRANSITO
    await prisma.paquete.updateMany({
      where: { tracking: { in: trackings } },
      data: { estado: "EN_TRANSITO" },
    });

    // Agrupar paquetes por cliente para generar facturas
    type PaqueteParaFactura = {
      tracking: number;
      pesoLb: number;
      pieCubico: number;
      tipoEnvio: "AVION" | "BARCO";
    };

    // Mapear y agrupar por clienteOrigenId
    const paquetesPorCliente: Record<number, PaqueteParaFactura[]> = {};

    for (const p of paquetesDB) {
      const pesoLb = p.medidas.peso; // ya en libras asumo
      const pieCubico = calcularPieCubico(
        p.medidas.largo,
        p.medidas.ancho,
        p.medidas.alto
      );

      // El enum TipoEnvio en Prisma es mayúscula, negocio usa minus
      const tipoStr = p.tipoEnvio === "AVION" ? "AVION" : "BARCO";

      const paqueteFactura: PaqueteParaFactura = {
        tracking: p.tracking,
        pesoLb,
        pieCubico,
        tipoEnvio: tipoStr,
      };

      if (!paquetesPorCliente[p.clienteOrigenId]) {
        paquetesPorCliente[p.clienteOrigenId] = [];
      }
      paquetesPorCliente[p.clienteOrigenId].push(paqueteFactura);
    }

    // Para cada cliente, generar factura y detalles
    for (const clienteIdStr in paquetesPorCliente) {
      const clienteId = Number(clienteIdStr);
      const paquetesCliente = paquetesPorCliente[clienteId];

      // Generar la factura (calcula total y items)
      const paquetesClienteMapped = paquetesCliente.map((p) => ({
        ...p,
        tipoEnvio: p.tipoEnvio as "AVION" | "BARCO",
      }));
      const { total, items } = generarFactura(paquetesClienteMapped);

      // Crear factura en DB
      const facturaCreada = await prisma.factura.create({
        data: {
          estado: "PENDIENTE",
          monto: total,
          metodoPago: "POR DEFINIR",
          cantPiezas: items.length,
          envioNumero: nuevoEnvio.numero,
          clienteCedula: clienteId,
          detalleFactura: {
            create: items.map((it) => ({
              paqueteTracking: it.tracking,
            })),
          },
        },
      });
    }

    return NextResponse.json(
      { success: true, data: nuevoEnvio },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error al registrar envío:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al registrar el envío",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const estado = "REGISTRADO";

    const where: Prisma.PaqueteWhereInput = {};

    if (estado) {
      where.estado = estado;
    }

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
    });

    const paquetesEnriquecidos = paquetes.map((paquete) => {
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

    return NextResponse.json(paquetesEnriquecidos);
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
