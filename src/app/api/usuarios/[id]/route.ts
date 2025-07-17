import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { Rol } from '@prisma/client'

// Helper para extraer el ID de la URL y convertirlo a número
function getIdFromUrl(url: string): number {
  const parts = url.split('/')
  const id = parts[parts.length - 1]
  return parseInt(id, 10)
}

// GET - Obtener usuario por ID
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.url)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      )
    }

    console.log(`[GET] Buscando usuario con ID: ${id}`)

    const usuario = await prisma.usuario.findUnique({
      where: { 
        id: id
      },
      include: {
        roles: {
          select: {
            rol: true
          }
        }
      }
    })

    if (!usuario) {
      console.log(`[GET] Usuario no encontrado con ID: ${id}`)
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    console.log(`[GET] Usuario encontrado:`, { 
      id: usuario.id, 
      cedula: usuario.cedula 
    })

    // Mapear los roles a un array simple de strings
    const roles = usuario.roles.map(r => r.rol)

    return NextResponse.json({
      success: true,
      data: {
        ...usuario,
        roles: roles
      }
    })

  } catch (error) {
    console.error('[GET] Error:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// PUT - Actualizar usuario por ID
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.url)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      )
    }

    console.log(`[PUT] Iniciando actualización para ID: ${id}`)
    
    const body = await request.json()
    console.log('[PUT] Datos recibidos:', body)

    // 1. Buscar usuario existente
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id: id },
      include: { 
        roles: {
          select: {
            rol: true
          }
        }
      }
    })

    if (!usuarioExistente) {
      console.log(`[PUT] Usuario no encontrado con ID: ${id}`)
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    console.log(`[PUT] Usuario encontrado - ID: ${usuarioExistente.id}`)

    // 2. Validar campos únicos si se modifican
    const { cedula: nuevaCedula, email: nuevoEmail } = body

    if (nuevaCedula && nuevaCedula !== usuarioExistente.cedula) {
      console.log(`[PUT] Validando nueva cédula: ${nuevaCedula}`)
      const cedulaExistente = await prisma.usuario.findFirst({
        where: { 
          cedula: nuevaCedula,
          NOT: { id: id }
        }
      })
      if (cedulaExistente) {
        console.log(`[PUT] La cédula ${nuevaCedula} ya está registrada`)
        return NextResponse.json(
          { success: false, error: "La cédula ya existe" },
          { status: 409 }
        )
      }
    }

    if (nuevoEmail && nuevoEmail !== usuarioExistente.email) {
      console.log(`[PUT] Validando nuevo email: ${nuevoEmail}`)
      const emailExistente = await prisma.usuario.findFirst({
        where: { 
          email: nuevoEmail,
          NOT: { id: id }
        }
      })
      if (emailExistente) {
        console.log(`[PUT] El email ${nuevoEmail} ya está registrado`)
        return NextResponse.json(
          { success: false, error: "El email ya existe" },
          { status: 409 }
        )
      }
    }

    // 3. Actualizar datos
    console.log('[PUT] Actualizando usuario...')
    const usuarioActualizado = await prisma.$transaction(async (tx) => {
      // Actualizar datos básicos del usuario
      const usuario = await tx.usuario.update({
        where: { id: id },
        data: {
          cedula: nuevaCedula || usuarioExistente.cedula,
          email: nuevoEmail || usuarioExistente.email,
          nombre: body.nombre || usuarioExistente.nombre,
          apellido: body.apellido || usuarioExistente.apellido,
          telefono: body.telefono || usuarioExistente.telefono,
          activo: body.activo !== undefined ? body.activo : usuarioExistente.activo
        }
      })

      // Actualizar rol si se especifica
      if (body.rol && Object.values(Rol).includes(body.rol)) {
        console.log(`[PUT] Actualizando rol a: ${body.rol}`)
        
        // Primero, verificar si ya existe un rol para este usuario
        const rolExistente = await tx.usuarioRol.findFirst({
          where: { usuarioId: id }
        })

        if (rolExistente) {
          // Actualizar rol existente
          await tx.usuarioRol.update({
            where: { id: rolExistente.id },
            data: { rol: body.rol as Rol }
          })
        } else {
          // Crear nuevo rol
          await tx.usuarioRol.create({
            data: {
              usuarioId: id,
              rol: body.rol as Rol
            }
          })
        }
      }

      return usuario
    })

    console.log('[PUT] Actualización exitosa:', {
      id: usuarioActualizado.id,
      cedula: usuarioActualizado.cedula
    })

    // Obtener el usuario con los roles actualizados
    const usuarioConRoles = await prisma.usuario.findUnique({
      where: { id: id },
      include: {
        roles: {
          select: {
            rol: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        ...usuarioActualizado,
        roles: usuarioConRoles?.roles.map(r => r.rol) || []
      }
    })

  } catch (error) {
    console.error('[PUT] Error en transacción:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}

// DELETE - Eliminación lógica por ID
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.url)
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      )
    }

    console.log(`[DELETE] Iniciando desactivación para ID: ${id}`)

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id }
    })

    if (!usuarioExistente) {
      console.log(`[DELETE] Usuario no encontrado con ID: ${id}`)
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      )
    }

    console.log(`[DELETE] Usuario encontrado - ID: ${usuarioExistente.id}`)

    // Eliminación lógica
    await prisma.usuario.update({
      where: { id: usuarioExistente.id },
      data: { activo: false }
    })

    console.log(`[DELETE] Usuario desactivado - ID: ${usuarioExistente.id}`)

    return NextResponse.json({
      success: true,
      message: "Usuario desactivado correctamente",
      data: {
        id: usuarioExistente.id,
        nombreCompleto: `${usuarioExistente.nombre} ${usuarioExistente.apellido}`
      }
    })

  } catch (error) {
    console.error('[DELETE] Error al desactivar usuario:', error)
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}