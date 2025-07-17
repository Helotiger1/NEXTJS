import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Leer filtros opcionales
    const tipo = searchParams.get("tipo") || undefined;
    const cliente = searchParams.get("cliente") || undefined;
    const estado = searchParams.get("estado") || undefined;

    const empleadoCedulaStr = searchParams.get("empleadoCedula");
    const empleadoCedula = empleadoCedulaStr
      ? parseInt(empleadoCedulaStr)
      : undefined;

    const clienteIdStr = searchParams.get("clienteId");
    const clienteId = clienteIdStr ? parseInt(clienteIdStr) : undefined;

    const fechaSalidaDesdeStr = searchParams.get("fechaSalidaDesde");
    const fechaSalidaHastaStr = searchParams.get("fechaSalidaHasta");

    const where: any = {};

    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;
    if (empleadoCedula) where.empleadoCedula = empleadoCedula;

    
    if (clienteId) {
      where.detalleEnvio = {
        some: {
          paquete: {
            OR: [
              { clienteOrigenId: clienteId },
              { clienteDestinoId: clienteId },
            ],
          },
        },
      };
    }

    if (fechaSalidaDesdeStr || fechaSalidaHastaStr) {
      where.fechaSalida = {};
      if (fechaSalidaDesdeStr)
        where.fechaSalida.gte = new Date(fechaSalidaDesdeStr);
      if (fechaSalidaHastaStr)
        where.fechaSalida.lte = new Date(fechaSalidaHastaStr);
    }

   const envios = await prisma.envio.findMany({
  where,
  orderBy: {
    estado: "desc", // "EN_TRANSITO" aparecerá primero
  },
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
    empleado: true,
    detalleEnvio: {
      include: { paquete: true },
    },
    facturas: true,
  },
});


    return NextResponse.json(envios);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener envíos" },
      { status: 500 }
    );
  }
}
