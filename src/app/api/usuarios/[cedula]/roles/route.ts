import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Rol } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Reemplazar los roles de un usuario
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ cedula: string }> }
) {
  const { cedula } = await params;

  if (!cedula) {
    return NextResponse.json(
      { error: "Cédula no proporcionada" },
      { status: 400 }
    );
  }

  try {
    const body = await req.json();
    const { roles } = body;

    if (!Array.isArray(roles) || roles.length === 0) {
      return NextResponse.json(
        { error: "Debes proporcionar al menos un rol válido" },
        { status: 400 }
      );
    }

    // Validar roles y convertirlos a tipo Rol
    const rolesFiltrados: Rol[] = roles
      .map((rol: string) => rol.toUpperCase())
      .filter((rol) => Object.values(Rol).includes(rol as Rol)) as Rol[];

    if (rolesFiltrados.length === 0) {
      return NextResponse.json(
        { error: "Ningún rol válido fue proporcionado" },
        { status: 400 }
      );
    }

    // Verificar que el usuario exista
    const usuario = await prisma.usuario.findUnique({
      where: { cedula },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar roles actuales
    await prisma.usuarioRol.deleteMany({
      where: { usuarioId: cedula },
    });

    // Asignar nuevos roles
    const nuevosRoles = rolesFiltrados.map((rol) => ({
      usuarioId: cedula,
      rol,
    }));

    await prisma.usuarioRol.createMany({
      data: nuevosRoles,
    });

    return NextResponse.json({
      mensaje: "Roles actualizados correctamente",
      roles: nuevosRoles,
    });
  } catch (error) {
    console.error("Error actualizando roles:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET: Obtener roles de un usuario por cédula
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ cedula: string }> }
) {
  const { cedula } = await params;

  if (!cedula) {
    return NextResponse.json({ error: 'Cédula no proporcionada' }, { status: 400 });
  }

  try {
    const roles = await prisma.usuarioRol.findMany({
      where: { usuarioId: cedula },
      select: { rol: true },
    });

    return NextResponse.json({ roles: roles.map(r => r.rol) }, { status: 200 });
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
