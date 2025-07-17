//listar facturas
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clienteId = searchParams.get("clienteId");

    let whereClause = {};

    if (clienteId) {
      whereClause = {
        clienteCedula: parseInt(clienteId),
      };
    }

    const facturas = await prisma.factura.findMany({
      where: whereClause,
      include: {
        cliente: true,
        envioNum: true,
        detalleFactura: {
          include: {
            paquete: {
              include: { medidas: true },
            },
          },
        },
      },
    });

    return NextResponse.json(facturas , { status: 200 });
  } catch (error) {
    console.error("Error al obtener facturas:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}