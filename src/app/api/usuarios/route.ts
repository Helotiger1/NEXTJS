import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma, Rol } from "@prisma/client";
import bcrypt from "bcryptjs";
import { validarUsuario } from "@lib/Validaciones_Usuarios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    const datosTransformados = {
      cedula: body.cedula,
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      telefono: body.telefono,
      contrasena: body.contrasena,
      activo: body.activo !== undefined ? body.activo : true, // Por defecto activo
      rol: body.rol || Rol.CLIENTE, // Valor por defecto
    };

    
    console.log(datosTransformados)
    // Validar campos primero (antes de verificar existencia)
    /* const errores = validarUsuario(datosTransformados);
    if (errores.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Error de validación",
          details: errores,
        },
        { status: 400 }
      );
    }
 */
    // Verificar existencia (cédula o email) en una sola consulta
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { cedula: datosTransformados.cedula },
          { email: datosTransformados.email },
        ],
      },
      include: { roles: true },
    });

    if (usuarioExistente) {
      // Determinar qué campo causó el conflicto
      const conflicto =
        usuarioExistente.cedula === datosTransformados.cedula
          ? "cedula"
          : "email";

      return NextResponse.json(
        {
          success: false,
          error: `${conflicto} ya está registrado`,
          data: {
            id: usuarioExistente.id,
            [conflicto]: usuarioExistente[conflicto],
          },
        },
        { status: 409 } // 409 para indicar conflicto
      );
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(datosTransformados.contrasena, 12);

    // Crear nuevo usuario
    const nuevoUsuario = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          cedula: datosTransformados.cedula,
          nombre: datosTransformados.nombre,
          apellido: datosTransformados.apellido,
          email: datosTransformados.email,
          telefono: datosTransformados.telefono,
          contrasena: hashedPassword,
          activo: datosTransformados.activo,
        },
      });

      await tx.usuarioRol.create({
        data: {
          usuarioId: usuario.id,
          rol: datosTransformados.rol,
        },
      });

      return usuario;
    });

    return NextResponse.json(
      {
        success: true,
        message: "Usuario creado exitosamente",
        data: {
          id: nuevoUsuario.id,
          cedula: nuevoUsuario.cedula,
          telefono: nuevoUsuario.telefono,
          apellido: nuevoUsuario.apellido,
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          activo: nuevoUsuario.activo,
          rol: datosTransformados.rol,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/usuario:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Obtener parámetros de filtro
    const rol = searchParams.get("rol");
    const activo = searchParams.get("activo");
    const search = searchParams.get("search");

    // Construir objeto WHERE para Prisma
    const where: Prisma.UsuarioWhereInput = {
      activo: true, // Por defecto solo usuarios activos
    };

    // Filtro por rol
    if (rol && Object.values(Rol).includes(rol as Rol)) {
      where.roles = {
        some: {
          rol: rol as Rol,
        },
      };
    }

    // Filtro por estado activo/inactivo
    if (activo !== null) {
      where.activo = activo === "true";
    }

    // Filtro de búsqueda general
    if (search) {
      where.OR = [
        { cedula: { contains: search, mode: "insensitive" } },
        { nombre: { contains: search, mode: "insensitive" } },
        { apellido: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const usuarios = await prisma.usuario.findMany({
      where,
      select: {
        id: true,
        cedula: true,
        nombre: true,
        apellido: true,
        telefono: true,
        email: true,
        activo: true,
        roles: {
          select: {
            rol: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    // Transformar los resultados para devolver el rol como string
    const usuariosTransformados = usuarios.map((usuario) => ({
      ...usuario,
      rol: usuario.roles[0]?.rol || null, // Tomamos el primer rol o null si no hay roles
    }));

    // Eliminamos el array roles del objeto final
    const resultadoFinal = usuariosTransformados.map(
      ({ roles, ...usuario }) => usuario
    );

    return NextResponse.json(resultadoFinal);
  } catch (error) {
    console.error("Error en GET /api/usuario:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener usuarios",
      },
      { status: 500 }
    );
  }
}
