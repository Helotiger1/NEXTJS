//Generar factura
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { generarFactura } from "@/app/lib/Logica_Negocio";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { envioNumero, clienteCedula, paquetes } = body;

    // Validaciones básicas
    if (!envioNumero || typeof envioNumero !== "number") {
      return NextResponse.json(
        { success: false, error: "El número de envío es requerido y debe ser numérico" },
        { status: 400 }
      );
    }

    if (!clienteCedula || typeof clienteCedula !== "number") {
      return NextResponse.json(
        { success: false, error: "clienteCedula es requerido y debe ser número" },
        { status: 400 }
      );
    }

    if (!Array.isArray(paquetes) || paquetes.length === 0) {
      return NextResponse.json(
        { success: false, error: "paquetes debe ser un arreglo con al menos un paquete" },
        { status: 400 }
      );
    }

    // Buscar el envío y sus paquetes con medidas
    const envio = await prisma.envio.findUnique({
      where: { numero: envioNumero },
      include: {
        detalleEnvio: {
          include: {
            paquete: {
              include: { medidas: true },
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

    // Filtrar los paquetes que vienen en el body para generar la factura
    const paquetesFiltrados = envio.detalleEnvio
      .map((d) => d.paquete)
      .filter((p) => paquetes.includes(p.tracking.toString()));

    if (paquetesFiltrados.length === 0) {
      return NextResponse.json(
        { success: false, error: "No hay paquetes asociados a este envío" },
        { status: 400 }
      );
    }

    // Preparar datos para generar factura según lógica de negocio
    const paquetesParaFactura = paquetesFiltrados.map((p) => ({
      tracking: p.tracking,
      pesoLb: p.medidas.peso,
      pieCubico: parseFloat((p.medidas.volumen / 1728).toFixed(2)),
      tipoEnvio: (envio.tipo.toUpperCase() === "" ? "BARCO" : "AVION") as "BARCO" | "AVION",
    }));

    const facturaGenerada = generarFactura(paquetesParaFactura);

    // 1. Crear la factura sin detalles
    const nuevaFactura = await prisma.factura.create({
      data: {
        estado: "pendiente",
        monto: facturaGenerada.total,
        metodoPago: "pendiente",
        cantPiezas: paquetesFiltrados.length,
        envioNumero,
        clienteCedula,
      },
    });

    // 2. Crear los detalles usando el número de factura recién creado
    for (const item of facturaGenerada.items) {
      await prisma.detalleFactura.create({
        data: {
          facturaNumero: nuevaFactura.numero,
          paqueteTracking: item.tracking,
        },
      });
    }

    // 3. Opcional: traer la factura con detalles para devolverla
    const facturaConDetalles = await prisma.factura.findUnique({
      where: { numero: nuevaFactura.numero },
      include: { detalleFactura: true },
    });

    return NextResponse.json(
      { success: true, factura: facturaConDetalles },
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