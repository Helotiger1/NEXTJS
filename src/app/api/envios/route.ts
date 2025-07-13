import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

// Tipos para TypeScript

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

    const [envios] = await Promise.all([
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
                  origen: true,
                },
              },
            },
          },
          facturas: {
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

    
    /*/Otra vez hare el mismo chiste, no movi mas nada,
    return NextResponse.json([
      {
        cod: "A1",
        origen: "Miami",
        destino: "Caracas",
        fechaSalida: "2025-07-14",
        tipo: "Barco",
        estado: "pendiente",
      },
      {
        cod: "B2",
        origen: "Bogotá",
        destino: "Panamá",
        fechaSalida: "2025-07-15",
        tipo: "Avión",
        estado: "enviado",
      },
      {
        cod: "C3",
        origen: "Buenos Aires",
        destino: "Santiago",
        fechaSalida: "2025-07-12",
        tipo: "Camión",
        estado: "entregado",
      }
    ]);*/

    return NextResponse.json(envios);
    
  } catch (error) {
    console.error("Error obteniendo envíos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
