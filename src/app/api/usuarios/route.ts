import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Rol } from "@prisma/client";
import bcrypt from "bcryptjs";
import { validarUsuario } from "@lib/Validaciones_Usuarios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validación básica de campos
    const errores = validarUsuario(body);
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

    const {
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      contrasena,
      rol = Rol.CLIENTE, // Asignar rol por defecto si no se proporciona
    } = body;

    // 2. Verificar unicidad (cedula/email)
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [{ cedula }, { email }],
      },
    });

    if (usuarioExistente) {
      const detallesError = [];
      if (usuarioExistente.cedula === cedula)
        detallesError.push("La cédula ya está registrada");
      if (usuarioExistente.email === email)
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
    const hashedPassword = await bcrypt.hash(contrasena, 12);

    // 4. Crear usuario con transacción
    const nuevoUsuario = await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.create({
        data: {
          cedula,
          nombre,
          apellido,
          email,
          telefono,
          contrasena: hashedPassword,
        },
      });

      await tx.usuarioRol.create({
        data: {
          usuarioId: usuario.id,
          rol: rol,
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
          rol: rol,
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
export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
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

    return NextResponse.json({
      success: true,
      data: usuarios.map((u) => ({
        ...u,
        roles: u.roles.map((r) => r.rol),
      })),
    });
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
