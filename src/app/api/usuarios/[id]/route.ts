import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { Rol } from '@prisma/client'

// GET - Obtener usuario por ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { 
        id: parseInt(params.id)
      },
      select: {
        id: true,
        cedula: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        activo: true,
        roles: {
          select: {
            rol: true
          }
        }
      }
    })

    if (!usuario) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        ...usuario,
        roles: usuario.roles.map(r => r.rol)
      }
    })

  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PATCH - Editar usuario
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const userId = parseInt(params.id)

    // Validar que el usuario exista
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: userId}
    })

    if (!usuarioExistente) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Campos editables (excluyendo campos sensibles)
    const { nombre, apellido, telefono, activo, rol } = body

    // Actualizar usuario
    const usuarioActualizado = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.update({
        where: { id: userId },
        data: {
          nombre,
          apellido,
          telefono,
          activo
        }
      })

      // Si se envió rol, actualizarlo
      if (rol && Object.values(Rol).includes(rol)) {
        await tx.usuarioRol.updateMany({
          where: { usuarioId: userId },
          data: { rol: rol as Rol }
        })
      }

      return usuario
    })

    // Obtener el rol actual del usuario después de la actualización
    const usuarioRoles = await prisma.usuarioRol.findMany({
      where: { usuarioId: userId },
      select: { rol: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        apellido: usuarioActualizado.apellido,
        telefono: usuarioActualizado.telefono,
        activo: usuarioActualizado.activo,
        rol: rol || usuarioRoles[0]?.rol
      }
    })

  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminación lógica
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id)

    // Verificar que el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: userId }
    })

    if (!usuarioExistente) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    // Eliminación lógica
    await prisma.usuario.update({
      where: { id: userId },
      data: { activo: false }
    })

    return NextResponse.json({
      success: true,
      message: "Usuario desactivado correctamente"
    })

  } catch (error) {
    console.error('Error al desactivar usuario:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}