//listar facturas
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        cliente: true,
        envioNum: true,
        detalleFactura: {
          include: {
            paquete: {
              include: {
                medidas: true,
              },
            },
          },
        },
      },
      orderBy: {
        numero: "desc",
      },
      take: 50, // opcional, limitar a 50 facturas
    });

    return NextResponse.json({ success: true, facturas }, { status: 200 });
  } catch (error) {
    console.error("Error al listar facturas:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}