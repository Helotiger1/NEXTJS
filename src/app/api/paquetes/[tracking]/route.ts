import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
  validarMedidas,
  validarTextoNoVacio,
} from "@/app/lib/Validaciones_Paquetes";

// PUT: Actualizar paquete por tracking
export async function PUT(req: NextRequest, { params }: { params: { tracking: string } }) {
  try {
    const userId = req.headers.get('userId');
    console.log(userId);
    const tracking = Number(params.tracking);
    console.log("🔄 [PUT] Tracking recibido:", params.tracking);

    if (isNaN(tracking)) {
      console.warn("❌ Tracking inválido:", params.tracking);
      return NextResponse.json({ success: false, error: "Tracking inválido" }, { status: 400 });
    }

    const body = await req.json();
    console.log("📦 Datos recibidos para actualización:", body);

    const {
      descripcion,
      origenId,
      destinoId,
      clienteOrigenId,
      clienteDestinoId,
      almacenCodigo,
      medidas = {},
    } = body;

    if ("estado" in body) {
      console.warn("⚠️ Intento de modificar el estado en PUT");
      return NextResponse.json(
        { success: false, error: "No se puede actualizar el estado desde este endpoint" },
        { status: 400 }
      );
    }

    const numericFields = [
      { field: "origenId", value: origenId },
      { field: "destinoId", value: destinoId },
      { field: "clienteOrigenId", value: clienteOrigenId },
      { field: "clienteDestinoId", value: clienteDestinoId },
      { field: "almacenCodigo", value: almacenCodigo },
    ];

    for (const { field, value } of numericFields) {
      if (value !== undefined && (isNaN(Number(value)) || Number(value) <= 0)) {
        console.warn(`❌ ${field} inválido:`, value);
        return NextResponse.json(
          { success: false, error: `${field} debe ser un número positivo válido` },
          { status: 400 }
        );
      }
    }
    
    // Validar empleadoId desde userId (header)
    const empleadoId = userId ? Number(userId) : undefined;

    if (!empleadoId || isNaN(empleadoId) || empleadoId <= 0) {
      console.warn("❌ userId inválido en el header:", userId);
      return NextResponse.json(
        { success: false, error: "Empleado no autenticado o ID inválido" },
        { status: 401 }
      );
    }

    const { largo = 0, ancho = 0, alto = 0, peso = 0 } = medidas;
    const medidasNumericas = {
      largo: Number(largo),
      ancho: Number(ancho),
      alto: Number(alto),
      peso: Number(peso),
    };
    console.log("📏 Medidas numéricas:", medidasNumericas);

    if (Object.values(medidasNumericas).some(isNaN)) {
      console.warn("❌ Medidas inválidas:", medidasNumericas);
      return NextResponse.json(
        { success: false, error: "Todas las medidas deben ser valores numéricos válidos" },
        { status: 400 }
      );
    }

    if (
      origenId !== undefined &&
      destinoId !== undefined &&
      Number(origenId) === Number(destinoId)
    ) {
      console.warn("❌ Almacén origen y destino son iguales");
      return NextResponse.json(
        { success: false, error: "El almacén origen y destino no pueden ser el mismo" },
        { status: 400 }
      );
    }

    if (
      clienteOrigenId !== undefined &&
      clienteDestinoId !== undefined &&
      Number(clienteOrigenId) === Number(clienteDestinoId)
    ) {
      console.warn("❌ Cliente origen y destino son iguales");
      return NextResponse.json(
        { success: false, error: "El cliente origen y destino no pueden ser el mismo" },
        { status: 400 }
      );
    }

    if (descripcion !== undefined) {
      const descError = validarTextoNoVacio(descripcion, "Descripción", { maxLength: 500 });
      if (descError) {
        console.warn("❌ Descripción inválida:", descError);
        return NextResponse.json({ success: false, error: descError }, { status: 400 });
      }
    }

    const medidasError = validarMedidas(medidasNumericas);
    if (medidasError) {
      console.warn("❌ Error en validación de medidas:", medidasError);
      return NextResponse.json({ success: false, error: medidasError }, { status: 400 });
    }

    const paqueteExistente = await prisma.paquete.findUnique({
      where: { tracking },
      include: { medidas: true },
    });

    if (!paqueteExistente) {
      console.warn("❌ Paquete no encontrado con tracking:", tracking);
      return NextResponse.json({ success: false, error: "Paquete no encontrado" }, { status: 404 });
    }

    console.log("✅ Paquete existente encontrado:", paqueteExistente.tracking);

    let medidasActualizadas = paqueteExistente.medidas;
    if (
      medidas.largo !== undefined ||
      medidas.ancho !== undefined ||
      medidas.alto !== undefined ||
      medidas.peso !== undefined
    ) {
      medidasActualizadas = await prisma.medidas.update({
        where: { id: paqueteExistente.medidasId },
        data: {
          largo: medidasNumericas.largo,
          ancho: medidasNumericas.ancho,
          alto: medidasNumericas.alto,
          peso: medidasNumericas.peso,
          volumen: parseFloat(
            (
              (medidasNumericas.largo *
                medidasNumericas.ancho *
                medidasNumericas.alto) /
              1728
            ).toFixed(2)
          ),
        },
      });
      console.log("🛠️ Medidas actualizadas:", medidasActualizadas);
    }

    const dataActualizar: {
      descripcion?: string;
      origenId?: number;
      destinoId?: number;
      clienteOrigenId?: number;
      clienteDestinoId?: number;
      almacenCodigo?: number;
      empleadoId?: number;
      medidasId?: number;
    } = {};
    if (descripcion !== undefined) dataActualizar.descripcion = descripcion.trim();
    if (origenId !== undefined) dataActualizar.origenId = Number(origenId);
    if (destinoId !== undefined) dataActualizar.destinoId = Number(destinoId);
    if (clienteOrigenId !== undefined) dataActualizar.clienteOrigenId = Number(clienteOrigenId);
    if (clienteDestinoId !== undefined) dataActualizar.clienteDestinoId = Number(clienteDestinoId);
    if (almacenCodigo !== undefined) dataActualizar.almacenCodigo = Number(almacenCodigo);
    if (empleadoId !== undefined) dataActualizar.empleadoId = Number(empleadoId);
    if (medidasActualizadas) dataActualizar.medidasId = medidasActualizadas.id;

    console.log("📝 Data para actualizar paquete:", dataActualizar);

    const paqueteActualizado = await prisma.paquete.update({
      where: { tracking },
      data: dataActualizar,
      include: {
        almacen: true,
        empleado: { select: { nombre: true, apellido: true, cedula: true } },
        origen: true,
        destino: true,
        medidas: true,
        clienteOrigen: { select: { nombre: true, apellido: true, cedula: true } },
        clienteDestino: { select: { nombre: true, apellido: true, cedula: true } },
      },
    });

    console.log("✅ Paquete actualizado:", paqueteActualizado.tracking);

    return NextResponse.json({ success: true, data: paqueteActualizado }, { status: 200 });
  } catch (error: unknown) {
    console.error("💥 Error PUT /api/paquetes/[tracking]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar paquete",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}

// GET: Obtener paquete por tracking
export async function GET(
  req: NextRequest,
  { params }: { params: { tracking: string } }
) {
  try {
    const tracking = Number(params.tracking);
    console.log("🔍 [GET] Tracking recibido:", params.tracking);

    if (isNaN(tracking)) {
      console.warn("❌ Tracking inválido:", params.tracking);
      return NextResponse.json({ success: false, error: "Tracking inválido" }, { status: 400 });
    }

    const paquete = await prisma.paquete.findUnique({
      where: { tracking },
      include: {
        almacen: { include: { direccion: true } },
        empleado: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            roles: { select: { rol: true } },
          },
        },
        origen: { include: { direccion: true } },
        destino: { include: { direccion: true } },
        medidas: true,
        clienteOrigen: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        clienteDestino: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        detalleEnvio: {
          include: {
            envio: {
              include: {
                Origen: { include: { direccion: true } },
                Envio: { include: { direccion: true } },
                empleado: { select: { nombre: true, apellido: true } },
              },
            },
          },
          orderBy: { envio: { fechaSalida: "asc" } },
        },
        detalleFactura: {
          include: {
            factura: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
    });

    if (!paquete) {
      console.warn("❌ Paquete no encontrado con tracking:", tracking);
      return NextResponse.json({ success: false, error: "Paquete no encontrado" }, { status: 404 });
    }

    let diasTransito = null;
    let envioActual = null;

    if (paquete.detalleEnvio.length > 0) {
      envioActual = paquete.detalleEnvio[0].envio;
      if (envioActual?.fechaSalida) {
        const fechaSalida = new Date(envioActual.fechaSalida);
        diasTransito = Math.floor(
          (Date.now() - fechaSalida.getTime()) / (1000 * 60 * 60 * 24)
        );
      }
    }

    let tarifaEstimada = null;
    if (envioActual) {
      const volumenPiesCubicos =
        (paquete.medidas.largo * paquete.medidas.ancho * paquete.medidas.alto) / 1728;
      if (envioActual.tipo === "BARCO") {
        tarifaEstimada = Math.max(volumenPiesCubicos * 25, 35);
      } else if (envioActual.tipo === "AVION") {
        const porPeso = paquete.medidas.peso * 7;
        const porVolumen = volumenPiesCubicos * 7;
        tarifaEstimada = Math.max(Math.max(porPeso, porVolumen), 45);
      }
    }

    console.log("✅ Paquete encontrado y datos calculados:", { diasTransito, tarifaEstimada });

    return NextResponse.json({
      success: true,
      data: {
        ...paquete,
        diasTransito,
        tarifaEstimada,
      },
    });
  } catch (error: unknown) {
    console.error("💥 Error GET /api/paquetes/[tracking]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener paquete",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar paquete por tracking
export async function DELETE(
  req: NextRequest,
  { params }: { params: { tracking: string } }
) {
  try {
    const tracking = Number(params.tracking);
    console.log("🗑️ [DELETE] Tracking recibido:", params.tracking);

    if (isNaN(tracking)) {
      console.warn("❌ Tracking inválido:", params.tracking);
      return NextResponse.json({ success: false, error: "Tracking inválido" }, { status: 400 });
    }

    const paqueteExistente = await prisma.paquete.findUnique({
      where: { tracking },
    });

    if (!paqueteExistente) {
      console.warn("❌ Paquete no encontrado para eliminar con tracking:", tracking);
      return NextResponse.json({ success: false, error: "Paquete no encontrado" }, { status: 404 });
    }

    await prisma.paquete.delete({
      where: { tracking },
    });

    console.log("✅ Paquete eliminado con tracking:", tracking);

    return NextResponse.json({ success: true, message: "Paquete eliminado correctamente" }, { status: 200 });
  } catch (error: unknown) {
    console.error("💥 Error DELETE /api/paquetes/[tracking]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar paquete",
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
