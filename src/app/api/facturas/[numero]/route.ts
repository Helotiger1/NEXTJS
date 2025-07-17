//ver factura, actualizar estado /metodo de pago y eliminar factura
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
  validarEstadoFactura,
  validarMetodoPago,
} from "@/app/lib/Validaciones_Facturas";

// GET: Ver factura
export async function GET(
  req: NextRequest,
  context: { params: { numero: string } }
) {
  try {
    const {numero} = await context.params;
    const numeroFactura = parseInt(numero, 10);

    if (isNaN(numeroFactura)) {
      return NextResponse.json(
        { success: false, error: "Número de factura inválido" },
        { status: 400 }
      );
    }

    const factura = await prisma.factura.findUnique({
      where: { numero: numeroFactura },
      include: {
        detalleFactura: {
          include: {
            paquete: {
              include: {
                medidas: true,
              },
            },
          },
        },
        envioNum: true,
        cliente: true,
      },
    });

    if (!factura) {
      return NextResponse.json(
        { success: false, error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, factura }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener factura:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT: Editar estado y método de pago
export async function PUT(
  req: NextRequest,
  context: { params: { numero: string } }
) {
  try {
    const {numero} = await context.params;
    const numeroFactura = parseInt(numero, 10);

    if (isNaN(numeroFactura)) {
      return NextResponse.json(
        { success: false, error: "Número de factura inválido" },
        { status: 400 }
      );
    }

    const { estado, metodoPago } = await req.json();

    // Validaciones
    if (!estado || typeof estado !== "string") {
      return NextResponse.json(
        { success: false, error: "Estado de factura requerido" },
        { status: 400 }
      );
    }

    const errorEstado = validarEstadoFactura(estado);
    if (errorEstado) {
      return NextResponse.json(
        { success: false, error: errorEstado },
        { status: 400 }
      );
    }

    if (!metodoPago || typeof metodoPago !== "string") {
      return NextResponse.json(
        { success: false, error: "Método de pago requerido" },
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

    // Verificar que la factura existe
    const facturaExistente = await prisma.factura.findUnique({
      where: { numero: numeroFactura },
    });

    if (!facturaExistente) {
      return NextResponse.json(
        { success: false, error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar factura
    const facturaActualizada = await prisma.factura.update({
      where: { numero: numeroFactura },
      data: {
        estado,
        metodoPago,
      },
    });

    return NextResponse.json(
      { success: true, factura: facturaActualizada },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar factura:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
// DELETE: Eliminar factura por número
export async function DELETE(
    req: NextRequest,
    context: { params: { numero: string } }
  ) {
    try {
      const {numero} = await context.params;
      const numeroFactura = parseInt(numero, 10);
  
      if (isNaN(numeroFactura)) {
        return NextResponse.json(
          { success: false, error: "Número de factura inválido" },
          { status: 400 }
        );
      }
  
      // Verificar existencia
      const factura = await prisma.factura.findUnique({
        where: { numero: numeroFactura },
        include: { detalleFactura: true },
      });
  
      if (!factura) {
        return NextResponse.json(
          { success: false, error: "Factura no encontrada" },
          { status: 404 }
        );
      }
  
      // Primero eliminar los detalles
      await prisma.detalleFactura.deleteMany({
        where: { facturaNumero: numeroFactura },
      });
  
      // Luego eliminar la factura
      await prisma.factura.delete({
        where: { numero: numeroFactura },
      });
  
      return NextResponse.json(
        { success: true, message: "Factura eliminada correctamente" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error al eliminar factura:", error);
      return NextResponse.json(
        { success: false, error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  }
  