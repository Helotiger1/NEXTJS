import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

interface Params {
  params: { numero: string };
}

// GET /api/envios/[numero]
export async function GET(request: Request, { params }: Params) {
  try {
    const numeroEnvio = parseInt(params.numero);
    if (isNaN(numeroEnvio)) {
      return NextResponse.json({ error: "Número de envío inválido" }, { status: 400 });
    }

    const envio = await prisma.envio.findUnique({
      where: { numero: numeroEnvio },
      include: {
        Origen: true,
        Envio: true,
        empleado: true,
        detalleEnvio: {
          include: { paquete: true },
        },
        facturas: true,
      },
    });

    if (!envio) {
      return NextResponse.json({ error: "Envío no encontrado" }, { status: 404 });
    }

    return NextResponse.json(envio);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PUT /api/envios/[numero]
export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const numeroEnvio = Number(params.numero); // Asumiendo que viene por URL
    const body = await req.json();
    console.log(body);
    const {
      tipo,
      estado,
      almacenOrigen,
      almacenEnvio,
      detalleEnvio,
    } = body;

    // Actualizar el envío con los datos recibidos directamente
    const envioActualizado = await prisma.envio.update({
      where: { numero: numeroEnvio },
      data: {
        tipo,
        estado,
        almacenOrigen,
        almacenEnvio,
      },
    });
    console.log(detalleEnvio)

    if (estado === "EN ALMACEN" && Array.isArray(detalleEnvio)) {
  await Promise.all(
    detalleEnvio.map((detalle: any) =>
      prisma.paquete.update({
        where: { tracking: detalle.paquete.tracking },
        data: { estado: "REGISTRADO" },
      })
    )
  );
}


    return NextResponse.json({ success: true, data: envioActualizado });
  } catch (error) {
    console.error("❌ Error actualizando envío:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al actualizar" },
      { status: 500 }
    );
  }
}


// DELETE /api/envios/[numero]
export async function DELETE(request: Request, { params }: Params) {
  try {
    const numeroEnvio = parseInt(params.numero);
    if (isNaN(numeroEnvio)) {
      return NextResponse.json({ error: "Número de envío inválido" }, { status: 400 });
    }

    // Eliminar detalles para evitar error de FK
    await prisma.detalleEnvio.deleteMany({ where: { envioNumero: numeroEnvio } });

    // Eliminar el envío
    await prisma.envio.delete({ where: { numero: numeroEnvio } });

    return NextResponse.json({ message: "Envío eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno al eliminar" }, { status: 500 });
  }
}
