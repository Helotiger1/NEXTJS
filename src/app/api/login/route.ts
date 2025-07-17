import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

export async function POST(req: NextRequest) {
  try {
    const { email, contraseña } = await req.json();

    if (!email || !contraseña) {
      return NextResponse.json(
        { error: 'Faltan credenciales: email y contraseña son obligatorias.' },
        { status: 400 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        roles: {
          select: {
            rol: true,
          },
        },
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas: Usuario no encontrado o email incorrecto.' },
        { status: 401 }
      );
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { error: 'Su cuenta está inactiva. Por favor, contacte al administrador.' },
        { status: 403 }
      );
    }

    const validPassword = await bcrypt.compare(contraseña, usuario.contrasena);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Credenciales inválidas: Contraseña incorrecta.' },
        { status: 401 }
      );
    }

    const rol = usuario.roles[0].rol;

    // Crear token con jose
    const alg = 'HS256';
    const secret = new TextEncoder().encode(JWT_SECRET);

    const token = await new SignJWT({
      nombre: usuario.nombre,
      userId: usuario.id,
      cedula: usuario.cedula,
      email: usuario.email,
      rol,
    })
      .setProtectedHeader({ alg })
      .setExpirationTime('1h')
      .sign(secret);

    // Crear cookie HttpOnly con el token
    const cookie = serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json(
      {
        usuario: {
          id: usuario.id,
          cedula: usuario.cedula,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          telefono: usuario.telefono,
          rol,
        },
        mensaje: 'Inicio de sesión exitoso.',
      },
      {
        status: 200,
        headers: { 'Set-Cookie': cookie },
      }
    );
  } catch (error: unknown) {
    console.error('Error en login:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor al intentar iniciar sesión.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
