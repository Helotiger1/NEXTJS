import { NextRequest, NextResponse } from "next/server";
import { PrismaClient} from "@prisma/client";
import {
  calcularPieCubico,
  calcularPrecioEnvio,
} from "@/app/lib/Logica_Negocio";

import {
  validarEstadoFactura,
  validarMetodoPago,
} from "@/app/lib/Validaciones_Facturas";

const prisma = new PrismaClient();

/**
 * GET /api/facturas/[numero]
 * Obtiene una factura por su número, incluyendo detalle con montos calculados para cada paquete.
 * 
 * Params:
 *  - numero (en URL): número identificador de la factura.
 * 
 * Respuestas:
 *  - 200: Devuelve la factura con su detalle y montos calculados.
 *  - 400: Número inválido.
 *  - 404: Factura no encontrada.
 *  - 500: Error interno del servidor.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { numero: string } }
) {
  const numeroFactura = parseInt(params.numero);

  if (isNaN(numeroFactura)) {
    return NextResponse.json(
      { error: "Número de factura inválido" },
      { status: 400 }
    );
  }

  try {
    const factura = await prisma.factura.findUnique({
      where: { numero: numeroFactura },
      include: {
        detalleFactura: {
          include: {
            paquete: {
              include: { medidas: true },
            },
          },
        },
        cliente: true,
        envioNum: true,
      },
    });

    if (!factura) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    const detalleConMontos = factura.detalleFactura.map((detalle) => {
      const paquete = detalle.paquete;
      const medidas = paquete?.medidas;

      const pieCubico = medidas
        ? calcularPieCubico(medidas.largo, medidas.ancho, medidas.alto)
        : 0;

      const montoCalculado = paquete
        ? calcularPrecioEnvio(
            paquete.estado === "barco" ? "barco" : "avion",
            medidas?.peso ?? 0,
            pieCubico
          )
        : 0;

      return {
        numero: detalle.numero,
        facturaNumero: detalle.facturaNumero,
        paqueteTracking: detalle.paqueteTracking,
        montoCalculado,
      };
    });

    return NextResponse.json({
      ...factura,
      detalleFactura: detalleConMontos,
    });
  } catch (error) {
    console.error("Error obteniendo factura:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/facturas/[numero]
 * Actualiza campos de una factura (solo estado y método de pago).
 * 
 * Params:
 *  - numero (en URL): número identificador de la factura.
 * Body:
 *  - estado? (string): nuevo estado (pendiente, pagada, cancelada).
 *  - metodoPago? (string): nuevo método de pago (efectivo, tarjeta, transferencia).
 * 
 * Respuestas:
 *  - 200: Factura actualizada con éxito.
 *  - 400: Datos inválidos o faltantes.
 *  - 404: Factura no encontrada.
 *  - 500: Error interno del servidor.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { numero: string } }
) {
  const numeroFactura = parseInt(params.numero);
  if (isNaN(numeroFactura)) {
    return NextResponse.json(
      { error: "Número de factura inválido" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { estado, metodoPago } = body;

  if (!estado && !metodoPago) {
    return NextResponse.json(
      { error: "No se proporcionaron campos para actualizar" },
      { status: 400 }
    );
  }

  if (estado) {
    const errEstado = validarEstadoFactura(estado);
    if (errEstado) return NextResponse.json({ error: errEstado }, { status: 400 });
  }
  if (metodoPago) {
    const errMetodo = validarMetodoPago(metodoPago);
    if (errMetodo) return NextResponse.json({ error: errMetodo }, { status: 400 });
  }

  try {
    const facturaExistente = await prisma.factura.findUnique({
      where: { numero: numeroFactura },
    });
    if (!facturaExistente) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    const facturaActualizada = await prisma.factura.update({
      where: { numero: numeroFactura },
      data: {
        ...(estado ? { estado } : {}),
        ...(metodoPago ? { metodoPago } : {}),
      },
    });

    return NextResponse.json(facturaActualizada);
  } catch (error) {
    console.error("Error actualizando factura:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/facturas/[numero]
 * Elimina una factura y sus detalles asociados.
 * También actualiza el estado de los paquetes relacionados (opcional).
 * 
 * Params:
 *  - numero (en URL): número identificador de la factura.
 * 
 * Respuestas:
 *  - 200: Factura eliminada correctamente.
 *  - 400: Número inválido.
 *  - 404: Factura no encontrada.
 *  - 500: Error interno del servidor.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { numero: string } }
) {
  const numeroFactura = parseInt(params.numero);
  if (isNaN(numeroFactura)) {
    return NextResponse.json(
      { error: "Número de factura inválido" },
      { status: 400 }
    );
  }

  try {
    const facturaExistente = await prisma.factura.findUnique({
      where: { numero: numeroFactura },
      include: { detalleFactura: true },
    });

    if (!facturaExistente) {
      return NextResponse.json(
        { error: "Factura no encontrada" },
        { status: 404 }
      );
    }

    // Actualizar estado paquetes a "recibido en almacén" (o el estado que prefieras)
    for (const detalle of facturaExistente.detalleFactura) {
      await prisma.paquete.update({
        where: { tracking: detalle.paqueteTracking },
        data: { estado: "recibido en almacén" },
      });
    }

    await prisma.detalleFactura.deleteMany({
      where: { facturaNumero: numeroFactura },
    });

    await prisma.factura.delete({
      where: { numero: numeroFactura },
    });

    return NextResponse.json({ message: "Factura eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando factura:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
