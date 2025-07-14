import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma, Rol } from "@prisma/client";
import bcrypt from "bcryptjs";
import { validarUsuario } from "@lib/Validaciones_Usuarios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body)
    // Desempaquetar datos planos a estructura esperada
    const datosTransformados = {
      cedula: body.cedula,
      nombre: body.nombre,
      apellido: body.apellido,
      email: body.email,
      telefono: body.telefono,
      contrasena: body.contraseña,
      rol: body.rol || Rol.CLIENTE, // Valor por defecto
    };

    // 1. Validación básica de campos (usar datosTransformados)
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

    // 2. Verificar unicidad (cedula/email)
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [
          { cedula: datosTransformados.cedula },
          { email: datosTransformados.email },
        ],
      },
    });

    if (usuarioExistente) {
      const detallesError = [];
      if (usuarioExistente.cedula === datosTransformados.cedula)
        detallesError.push("La cédula ya está registrada");
      if (usuarioExistente.email === datosTransformados.email)
        detallesError.push("El email ya está registrado");

      return NextResponse.json(
        {
          success: false,
          error: "Conflicto de datos",
          details: detallesError,
        },
        { status: 409 }
      );
    }

    // 3. Hash de contraseña
    const hashedPassword = await bcrypt.hash(datosTransformados.contrasena, 12);

    // 4. Crear usuario con transacción
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

    // 5. Respuesta exitosa (sin datos sensibles)
    return NextResponse.json(
      {
        success: true,
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
