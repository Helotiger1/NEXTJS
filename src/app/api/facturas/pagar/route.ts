//registrar pago
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { validarEstadoFactura, validarMetodoPago } from "@/app/lib/Validaciones_Facturas";

export async function POST(req: NextRequest) {
  try {
    const { numeroFactura, metodoPago } = await req.json();

    if (!numeroFactura || typeof numeroFactura !== "number") {
      return NextResponse.json(
        { success: false, error: "Número de factura inválido" },
        { status: 400 }
      );
    }

    if (!metodoPago || typeof metodoPago !== "string") {
      return NextResponse.json(
        { success: false, error: "Método de pago inválido" },
        { status: 400 }
      );
    }

    const errorMetodo = validarMetodoPago(metodoPago);
    if (errorMetodo) {
      return NextResponse.json(
        { success: false, error: errorMetodo },
        { status: 400 }
      );
    }

    // Buscar factura
    const factura = await prisma.factura.findUnique({
      where: { numero: numeroFactura },
    });

    if (!factura) {
      return NextResponse.json(
        { success: false, error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    if (factura.estado.toLowerCase() === "pagada") {
      return NextResponse.json(
        { success: false, error: "La factura ya está pagada" },
        { status: 400 }
      );
    }

    // Actualizar factura
    const facturaActualizada = await prisma.factura.update({
      where: { numero: numeroFactura },
      data: {
        estado: "pagada",
        metodoPago,
      },
    });

    return NextResponse.json(
      { success: true, factura: facturaActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en pagar factura:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}