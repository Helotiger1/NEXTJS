import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Rol } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// POST: Crear un nuevo usuario (cliente por defecto)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Extraer los campos, acepta que venga 'contraseña' con ñ del frontend
    const {
      cedula,
      nombre,
      apellido,
      email,
      telefono,
      contraseña, // viene con ñ del JSON
      rol = 'CLIENTE',
    } = body;

    console.log(body);
    // Validaciones básicas
    if (!cedula || !nombre || !apellido || !email || !telefono || !contraseña) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    // Validar email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Validar si ya existe el usuario por cédula o email
    const usuarioExistente = await prisma.usuario.findUnique({ where: { cedula } });
    const emailExistente = await prisma.usuario.findFirst({ where: { email } });

    if (usuarioExistente) {
      return NextResponse.json({ error: 'Cédula ya registrada' }, { status: 400 });
    }

    if (emailExistente) {
      return NextResponse.json({ error: 'Email ya registrado' }, { status: 400 });
    }

    // Hashear la contraseña (nota: aquí 'contraseña' se usa solo como variable temporal)
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Crear usuario en la base con campo 'contrasena' (sin ñ)
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        cedula,
        nombre,
        apellido,
        email,
        telefono,
        contrasena: hashedPassword, // campo en la BD sin ñ
        roles: {
          create: {
            rol: rol.toUpperCase() as Rol,
          },
        },
      },
      include: {
        roles: true,
      },
    });

    return NextResponse.json({ mensaje: 'Usuario creado exitosamente', usuario: nuevoUsuario }, { status: 201 });

  } catch (error) {
    console.error('Error creando usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// GET: Obtener todos los usuarios con paginación y filtro por rol
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const rolQuery = searchParams.get('rol')?.toUpperCase();

    const skip = (page - 1) * limit;

    const where = rolQuery && Object.values(Rol).includes(rolQuery as Rol)
      ? {
          roles: {
            some: {
              rol: rolQuery as Rol,
            },
          },
        }
      : {};

    const usuarios = await prisma.usuario.findMany({
      where,
      skip,
      take: limit,
      include: {
        roles: true,
      },
    });

    const total = await prisma.usuario.count({ where });

    return NextResponse.json({
      page,
      limit,
      total,
      data: usuarios,
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

