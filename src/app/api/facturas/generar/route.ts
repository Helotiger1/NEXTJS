//Generar factura
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generarFactura } from "@/app/lib/Logica_Negocio";

export async function POST(req: NextRequest) {
  try {
    const { envioNumero } = await req.json();

    if (!envioNumero || typeof envioNumero !== "number") {
      return NextResponse.json(
        { success: false, error: "El número de envío es requerido y debe ser numérico" },
        { status: 400 }
      );
    }

    // Buscar el envío con sus paquetes
    const envio = await prisma.envio.findUnique({
      where: { numero: envioNumero },
      include: {
        detalleEnvio: {
          include: {
            paquete: {
              include: {
                medidas: true,
              },
            },
          },
        },
      },
    });

    if (!envio) {
      return NextResponse.json(
        { success: false, error: "Envío no encontrado" },
        { status: 404 }
      );
    }

    const paquetes = envio.detalleEnvio.map((detalle) => detalle.paquete);

    if (paquetes.length === 0) {
      return NextResponse.json(
        { success: false, error: "No hay paquetes asociados a este envío" },
        { status: 400 }
      );
    }

    const paquetesParaFactura = paquetes.map((paquete) => ({
      tracking: paquete.tracking,
      pesoLb: paquete.medidas.peso,
      pieCubico: parseFloat((paquete.medidas.volumen / 1728).toFixed(2)),
      tipoEnvio: (envio.tipo.toLowerCase() === "barco" ? "barco" : "avion") as "barco" | "avion",
    }));

    const facturaGenerada = generarFactura(paquetesParaFactura);

    // Crear factura
    const nuevaFactura = await prisma.factura.create({
      data: {
        estado: "pendiente",
        monto: facturaGenerada.total,
        metodoPago: "pendiente",
        cantPiezas: paquetes.length,
        envioNumero: envio.numero,
        clienteCedula: paquetes[0].clienteDestinoId, // Se asume que todos van al mismo cliente

        detalleFactura: {
          create: facturaGenerada.items.map((item) => ({
            paqueteTracking: item.tracking,
          })),
        },
      },
      include: {
        detalleFactura: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        factura: nuevaFactura,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al generar factura:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
