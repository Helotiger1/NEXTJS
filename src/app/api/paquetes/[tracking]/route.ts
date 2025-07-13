// src/app/api/paquetes/[tracking]/route.ts

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
  validarEstadoPaqueteString,
  estadosPaquetePermitidos,
} from "@/app/lib/Validaciones_Paquetes";
import { Prisma } from "@prisma/client";

type TrackingParams = {
  params: {
    tracking: string;
  };
};

export async function GET(req: NextRequest, { params }: TrackingParams) {
  try {
    const paquete = await prisma.paquete.findUnique({
      where: { tracking: Number(params.tracking) },
      include: {
        medidas: true,
        empleado: {
          select: {
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        origen: {
          select: {
            codigo: true,
            telefono: true,
            direccion: {
              select: {
                linea1: true,
                linea2: true,
                ciudad: true,
                estado: true,
                pais: true,
                codigoPostal: true,
              },
            },
          },
        },
        destino: {
          select: {
            codigo: true,
            telefono: true,
            direccion: {
              select: {
                linea1: true,
                linea2: true,
                ciudad: true,
                estado: true,
                pais: true,
                codigoPostal: true,
              },
            },
          },
        },
        almacen: {
          select: {
            codigo: true,
            telefono: true,
            direccion: {
              select: {
                linea1: true,
                linea2: true,
                ciudad: true,
                estado: true,
                pais: true,
                codigoPostal: true,
              },
            },
          },
        },
        detalleEnvio: {
          include: {
            envio: {
              include: {
                Origen: true,
                Envio: true,
              },
            },
          },
        },
        detalleFactura: {
          include: {
            factura: true,
          },
        },
      },
    });

    if (!paquete) {
      return NextResponse.json(
        { success: false, error: "Paquete no encontrado" },
        { status: 404 }
      );
    }

    let diasTransito = null;
    if (paquete.estado === "EN_TRANSITO" && paquete.detalleEnvio.length > 0) {
      const envio = paquete.detalleEnvio[0].envio;
      if (envio.fechaSalida) {
        const fechaSalida = new Date(envio.fechaSalida);
        diasTransito = Math.floor(
          (Date.now() - fechaSalida.getTime()) / (1000 * 60 * 60 * 24)
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...paquete,
        diasTransito,
      },
    });
  } catch (error) {
    console.error("Error GET /api/paquetes/[tracking]:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener el paquete" },
      { status: 500 }
    );
  }
}





export async function PUT(req: NextRequest, { params }: TrackingParams) {
  try {

    const body = await req.json();

    const { estado, almacenCodigo, empleadoCedula } = body;

    const errores = [];

    if (estado && !validarEstadoPaqueteString(estado)) {
      errores.push(
        `Estado inválido. Valores permitidos: ${estadosPaquetePermitidos.join(
          ", "
        )}`
      );
    }

    if (empleadoCedula && typeof empleadoCedula !== "string") {
      errores.push("Cédula de empleado inválida");
    }

    if (errores.length > 0) {
      return NextResponse.json(
        { success: false, errors: errores },
        { status: 400 }
      );
    }

    if (empleadoCedula) {
      const empleado = await prisma.usuario.findUnique({
        where: { cedula: empleadoCedula },
        include: { roles: true },
      });

      if (
        !empleado ||
        !empleado.roles.some((r) => r.rol === "EMPLEADO" || r.rol === "ADMIN")
      ) {
        return NextResponse.json(
          { success: false, error: "Acción no autorizada para este usuario" },
          { status: 403 }
        );
      }
    }

    const updateData: Prisma.PaqueteUpdateInput = {};
    if (estado) updateData.estado = estado;
    if (almacenCodigo) {
      // Actualizar la relación con el almacén
      updateData.almacen = {
        connect: { codigo: almacenCodigo },
      };
    }

    const paqueteActualizado = await prisma.paquete.update({
      where: { tracking: Number(params.tracking) },
      data: updateData,
      include: {
        medidas: true,
        empleado: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
        almacen: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: paqueteActualizado,
    });
  } catch (error) {
    console.error("Error PATCH /api/paquetes/[tracking]:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar el paquete" },
      { status: 500 }
    );
  }
}
