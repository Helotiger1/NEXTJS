import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { validarTelefono, validarDireccion } from '@lib/Validaciones_Almacenes'

// GET - Obtener un almacén específico
export async function GET(req: NextRequest, { params }: { params: { codigo: string } }) {
  try {
    const codigo = parseInt(params.codigo)
    
    if (isNaN(codigo)) {
      return NextResponse.json(
        { success: false, error: "Código de almacén inválido" },
        { status: 400 }
      )
    }

    const almacen = await prisma.almacen.findUnique({
      where: { codigo },
      include: {
        direccion: true,
        _count: {
          select: {
            paquetes: true,
            origenEnvios: true,
            destinoEnvios: true
          }
        }
      }
    })

    if (!almacen) {
      return NextResponse.json(
        { success: false, error: "Almacén no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...almacen,
        paquetesEnAlmacen: almacen._count.paquetes,
        enviosOrigen: almacen._count.origenEnvios,
        enviosDestino: almacen._count.destinoEnvios
      }
    })

  } catch (error) {
    console.error('Error al obtener almacén:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar almacén
export async function PUT(req: NextRequest, { params }: { params: { codigo: string } }) {
  try {
    const codigo = parseInt(params.codigo)
    const requestData = await req.json()

    if (isNaN(codigo)) {
      return NextResponse.json(
        { success: false, error: "Código de almacén inválido" },
        { status: 400 }
      )
    }

    // Validar datos recibidos
    const errores = [
      ...(requestData.telefono ? validarTelefono(requestData.telefono) : []),
      ...(requestData.direccion ? validarDireccion(requestData.direccion) : [])
    ]

    if (errores.length > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "Datos inválidos",
          details: errores 
        },
        { status: 400 }
      )
    }

    // Actualización transaccional
    const almacenActualizado = await prisma.$transaction(async (tx) => {
      const almacenExistente = await tx.almacen.findUnique({
        where: { codigo },
        include: { direccion: true }
      })

      if (!almacenExistente) {
        throw new Error("Almacén no encontrado")
      }

      // Actualizar dirección si se proporciona
      if (requestData.direccion) {
        await tx.direccion.update({
          where: { id: almacenExistente.direccionId },
          data: {
            linea1: requestData.direccion.linea1 || almacenExistente.direccion.linea1,
            linea2: requestData.direccion.linea2 || almacenExistente.direccion.linea2,
            pais: requestData.direccion.pais || almacenExistente.direccion.pais,
            estado: requestData.direccion.estado || almacenExistente.direccion.estado,
            ciudad: requestData.direccion.ciudad || almacenExistente.direccion.ciudad,
            codigoPostal: requestData.direccion.codigoPostal || almacenExistente.direccion.codigoPostal
          }
        })
      }

      // Actualizar teléfono si se proporciona
      if (requestData.telefono) {
        return await tx.almacen.update({
          where: { codigo },
          data: { telefono: requestData.telefono.toString() },
          include: { direccion: true }
        })
      }

      return almacenExistente
    })

    return NextResponse.json({
      success: true,
      data: almacenActualizado
    })

  } catch (error) {
    console.error('Error al actualizar almacén:', error)
    return NextResponse.json(
      { 
        success: false,
        error: typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Error interno del servidor"
          : "Error interno del servidor"
      },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar almacén (con validación de relaciones)
export async function DELETE(req: NextRequest, { params }: { params: { codigo: string } }) {
  try {
    const codigo = parseInt(params.codigo)

    if (isNaN(codigo)) {
      return NextResponse.json(
        { success: false, error: "Código de almacén inválido" },
        { status: 400 }
      )
    }

    // Verificar relaciones activas
    const relaciones = await prisma.$transaction([
      prisma.paquete.count({ where: { OR: [
        { origenId: codigo },
        { destinoId: codigo }
      ] }}),
      prisma.envio.count({ where: { OR: [
        { almacenOrigen: codigo },
        { almacenEnvio: codigo }
      ] }})
    ])

    const [totalPaquetes, totalEnvios] = relaciones

    if (totalPaquetes > 0 || totalEnvios > 0) {
      return NextResponse.json(
        { 
          success: false,
          error: "No se puede eliminar el almacén porque tiene relaciones activas",
          details: {
            paquetesRelacionados: totalPaquetes,
            enviosRelacionados: totalEnvios
          }
        },
        { status: 400 }
      )
    }

    // Eliminar en transacción
    await prisma.$transaction(async (tx) => {
      const almacen = await tx.almacen.findUnique({
        where: { codigo },
        select: { direccionId: true }
      })

      if (!almacen) throw new Error("Almacén no encontrado")

      await tx.almacen.delete({ where: { codigo } })
      await tx.direccion.delete({ where: { id: almacen.direccionId } })
    })

    return NextResponse.json({
      success: true,
      message: "Almacén eliminado correctamente"
    })

  } catch (error) {
    console.error('Error al eliminar almacén:', error)
    return NextResponse.json(
      { 
        success: false,
        error: typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Error interno del servidor"
          : "Error interno del servidor"
      },
      { status: 500 }
    )
  }
}