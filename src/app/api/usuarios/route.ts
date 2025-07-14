import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma, Rol } from "@prisma/client";
import bcrypt from "bcryptjs";
import { validarUsuario } from "@lib/Validaciones_Usuarios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body)
    // Desempaquetar datos planos
    const datosTransformados = {
      cedula: body.cedula,
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      telefono: body.telefono,
      contrasena: body.contrasena,
      rol: body.rol || Rol.CLIENTE, // Valor por defecto
    };

    // Buscar usuario existente por cédula
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { cedula: datosTransformados.cedula },
      include: { roles: true },
    });

    // Si ya existe, devolver el ID existente
    if (usuarioExistente) {
      return NextResponse.json(
        {
          success: true,
          message: "Usuario ya registrado",
          data: {
            id: usuarioExistente.id,
            cedula: usuarioExistente.cedula,
            nombre: usuarioExistente.nombre,
            email: usuarioExistente.email,
            rol: usuarioExistente.roles.map((r) => r.rol),
          },
        },
        { status: 200 }
      );
    }

    // Validar campos (solo si no existe)
    const errores = validarUsuario(datosTransformados);
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

    // Verificar que el email no esté en uso (por otro usuario)
    const emailEnUso = await prisma.usuario.findUnique({
      where: { email: datosTransformados.email },
    });

    if (emailEnUso) {
      return NextResponse.json(
        {
          success: false,
          error: "El email ya está registrado por otro usuario",
        },
        { status: 409 }
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
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
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


// GET - Obtener usuarios
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Obtener parámetros de filtro
    const rol = searchParams.get("rol");
    const activo = searchParams.get("activo");
    const search = searchParams.get("search");

    // Construir objeto WHERE para Prisma
    const where: Prisma.UsuarioWhereInput = {};

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

    // Filtro de búsqueda general (cedula, nombre, apellido, email)
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

    return NextResponse.json(usuarios);
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
