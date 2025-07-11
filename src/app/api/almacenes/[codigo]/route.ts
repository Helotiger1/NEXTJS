import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
    validarDireccion,
    validarTelefono,
    DireccionInput,
} from "@/app/lib/Validaciones_Almacenes";

const prisma = new PrismaClient();

// GET /api/almacenes/:codigo
export async function GET(
    request: Request,
    { params }: { params: { codigo: string } }
) {
    try {
        const codigoNum = Number(params.codigo);
        if (isNaN(codigoNum)) {
            return NextResponse.json(
                { error: "Código inválido" },
                { status: 400 }
            );
        }

        const almacen = await prisma.almacen.findUnique({
            where: { codigo: codigoNum },
            include: { direccion: true },
        });

        if (!almacen) {
            return NextResponse.json(
                { error: "Almacén no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(almacen);
    } catch (error) {
        console.error("ERROR GET /api/almacenes/[codigo] →", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// PUT /api/almacenes/:id
export async function PUT(
  request: Request,
  { params }: { params: { codigo: string } }
) {
  try {
    const codigo = Number(params.codigo);
    const body = await request.json();
    console.log("Si llego ", body, codigo)

    const almacen = await prisma.almacen.findUnique({
      where: { codigo },
    });

    if (!almacen) {
      return NextResponse.json(
        { error: "Almacén no encontrado" },
        { status: 404 }
      );
    }

    // Validar teléfono si existe
    if (body.telefono !== undefined) {
      const errorTelefono = validarTelefono(body.telefono);
      if (errorTelefono) {
        return NextResponse.json(
          { error: errorTelefono },
          { status: 400 }
        );
      }
    }

    // Validar dirección si existe
    if (body.direccion) {
      const { id: dirId, ...camposDireccion } = body.direccion;

      if (almacen.direccionId !== dirId) {
        return NextResponse.json(
          { error: "La dirección no pertenece a este almacén" },
          { status: 403 }
        );
      }

      const errorDireccion = validarDireccion(
        camposDireccion as DireccionInput
      );

      if (errorDireccion) {
        return NextResponse.json(
          { error: errorDireccion },
          { status: 400 }
        );
      }

      await prisma.direccion.update({
        where: { id: dirId },
        data: camposDireccion,
      });
    }

    // Actualizar teléfono si aplica
    if (body.telefono !== undefined) {
      await prisma.almacen.update({
        where: { codigo },
        data: { telefono: body.telefono },
      });
    }

    // Traer datos actualizados
    const almacenActualizado = await prisma.almacen.findUnique({
      where: { codigo },
      include: { direccion: true },
    });

    return NextResponse.json(almacenActualizado);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error al actualizar almacén",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// DELETE /api/almacenes/:id
export async function DELETE(
    request: Request,
    { params }: { params: { codigo: string } }
) {
    try {
const codigo = Number(params.codigo);
      console.log("el registro dice 10 pero, aqui dice:",codigo)
        const almacen = await prisma.almacen.findUnique({ where: { codigo } });
        if (!almacen) {
            return NextResponse.json(
                { error: "Almacén no encontrado" },
                { status: 404 }
            );
        }

        const paquetes = await prisma.paquete.findMany({
            where: { almacenCodigo: codigo },
        });
        if (paquetes.length > 0) {
            return NextResponse.json(
                {
                    error: "No se puede eliminar: hay paquetes asignados a este almacén",
                },
                { status: 409 }
            );
        }

        await prisma.$transaction([
            prisma.almacen.delete({ where: { codigo } }),
            prisma.direccion.delete({ where: { id: almacen.direccionId } }),
        ]);

        return NextResponse.json({
            message: "Almacén eliminado correctamente",
        });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                error: "Error al eliminar almacén",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}
