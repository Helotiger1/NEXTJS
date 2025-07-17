import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clienteIdStr = searchParams.get("clienteId");

    if (!clienteIdStr) {
      return NextResponse.json(
        { error: "clienteId es requerido" },
        { status: 400 }
      );
    }

    const clienteId = parseInt(clienteIdStr);

    const detalleEnvios = await prisma.detalleEnvio.findMany({
      where: {
        paquete: {
          OR: [
            { clienteOrigenId: clienteId },
            { clienteDestinoId: clienteId },
          ],
        },
      },
      include: {
        paquete: true,
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
          },
        },
      },
    });

    return NextResponse.json(detalleEnvios);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener detalles de envío" },
      { status: 500 }
    );
  }
}
