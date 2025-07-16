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
    const numeroEnvio = parseInt(params.numero);
    if (isNaN(numeroEnvio)) {
      return NextResponse.json({ error: "Número de envío inválido" }, { status: 400 });
    }

    const {
      tipo,
      estado,
      fechaSalida,
      fechaLlegada,
      almacenOrigen,
      almacenEnvio,
      empleadoCedula,
      detalleEnvioPaquetes, // array de tracking de paquetes para actualizar
    } = await req.json();

    let fechaSalidaDate, fechaLlegadaDate;
    if (fechaSalida) fechaSalidaDate = new Date(fechaSalida);
    if (fechaLlegada) fechaLlegadaDate = new Date(fechaLlegada);

    if (fechaSalidaDate && fechaLlegadaDate && fechaSalidaDate >= fechaLlegadaDate) {
      return NextResponse.json({ error: "La fecha de salida debe ser anterior a la fecha de llegada" }, { status: 400 });
    }

    const envioExistente = await prisma.envio.findUnique({ where: { numero: numeroEnvio } });
    if (!envioExistente) {
      return NextResponse.json({ error: "Envío no encontrado" }, { status: 404 });
    }

    if (almacenOrigen) {
      const almacenO = await prisma.almacen.findUnique({ where: { codigo: almacenOrigen } });
      if (!almacenO) return NextResponse.json({ error: "Almacén origen no existe" }, { status: 404 });
    }
    if (almacenEnvio) {
      const almacenD = await prisma.almacen.findUnique({ where: { codigo: almacenEnvio } });
      if (!almacenD) return NextResponse.json({ error: "Almacén destino no existe" }, { status: 404 });
    }
    if (empleadoCedula) {
      const empleado = await prisma.usuario.findUnique({ where: { id: empleadoCedula } });
      if (!empleado) return NextResponse.json({ error: "Empleado no existe" }, { status: 404 });
    }

    const envioActualizado = await prisma.envio.update({
      where: { numero: numeroEnvio },
      data: {
        tipo: tipo ?? envioExistente.tipo,
        estado: estado ?? envioExistente.estado,
        fechaSalida: fechaSalidaDate ?? envioExistente.fechaSalida,
        fechaLlegada: fechaLlegadaDate ?? envioExistente.fechaLlegada,
        almacenOrigen: almacenOrigen ?? envioExistente.almacenOrigen,
        almacenEnvio: almacenEnvio ?? envioExistente.almacenEnvio,
        empleadoCedula: empleadoCedula ?? envioExistente.empleadoCedula,
      },
    });

    if (Array.isArray(detalleEnvioPaquetes)) {
      // Eliminar los detalles existentes
      await prisma.detalleEnvio.deleteMany({ where: { envioNumero: numeroEnvio } });

      // Insertar los nuevos detalles
      for (const tracking of detalleEnvioPaquetes) {
        const paquete = await prisma.paquete.findUnique({ where: { tracking } });
        if (paquete) {
          await prisma.detalleEnvio.create({
            data: {
              envioNumero: numeroEnvio,
              paqueteTracking: tracking,
            },
          });
        }
      }
    }

    return NextResponse.json(envioActualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error interno al actualizar" }, { status: 500 });
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
