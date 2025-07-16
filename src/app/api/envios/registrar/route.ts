import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

// POST: Registrar un nuevo envío
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tipo,
      estado,
      fechaSalida,
      fechaLlegada,
      almacenOrigen,
      almacenEnvio,
      empleadoCedula,
      paquetes,
    } = body;

    console.log("📦 Datos recibidos para registrar envío:", body);

    // Validaciones básicas
    if (
      !tipo || !estado || !fechaSalida || !fechaLlegada ||
      !almacenOrigen || !almacenEnvio || !empleadoCedula ||
      !Array.isArray(paquetes) || paquetes.length === 0
    ) {
      return NextResponse.json({ success: false, error: "Todos los campos son obligatorios" }, { status: 400 });
    }

    if (!["BARCO", "AVION"].includes(tipo)) {
      return NextResponse.json({ success: false, error: "Tipo de envío inválido" }, { status: 400 });
    }

    if (almacenOrigen === almacenEnvio) {
      return NextResponse.json({ success: false, error: "El almacén origen y destino no pueden ser iguales" }, { status: 400 });
    }

    // Validar existencia de almacenes y empleado
    const [origen, destino, empleado] = await Promise.all([
      prisma.almacen.findUnique({ where: { codigo: almacenOrigen } }),
      prisma.almacen.findUnique({ where: { codigo: almacenEnvio } }),
      prisma.usuario.findUnique({ where: { id: empleadoCedula } }),
    ]);

    if (!origen || !destino || !empleado) {
      return NextResponse.json({ success: false, error: "Almacén o empleado no encontrado" }, { status: 404 });
    }

    // Validar que todos los paquetes existan
    const paquetesEncontrados = await prisma.paquete.findMany({
      where: { tracking: { in: paquetes } },
    });

    if (paquetesEncontrados.length !== paquetes.length) {
      return NextResponse.json({ success: false, error: "Uno o más paquetes no existen" }, { status: 404 });
    }

    // Crear el envío y asociar paquetes
    const nuevoEnvio = await prisma.envio.create({
      data: {
        tipo,
        estado,
        fechaSalida: new Date(fechaSalida),
        fechaLlegada: new Date(fechaLlegada),
        almacenOrigen,
        almacenEnvio,
        empleadoCedula,
        detalleEnvio: {
          create: paquetes.map((tracking: number) => ({
            paquete: { connect: { tracking } },
          })),
        },
      },
      include: {
        detalleEnvio: true,
      },
    });

    console.log("✅ Envío creado con éxito:", nuevoEnvio);

    return NextResponse.json({ success: true, data: nuevoEnvio }, { status: 201 });
  } catch (error) {
    console.error("❌ Error al registrar envío:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al registrar el envío",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET: Informar que este endpoint solo acepta POST
export async function GET() {
  return NextResponse.json(
    { success: false, message: "Este endpoint solo acepta POST para registrar envíos" },
    { status: 405 }
  );
}
