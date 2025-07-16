import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'bece484c8b3add2cfd95c566191cd5daae402865f5654821332d84a8a1e5a928'; // Clave rara

export async function POST(req: NextRequest) {
  try {
    // Extraer email y contraseña del cuerpo de la solicitud
    const { email, contraseña } = await req.json();

    // Validar que se proporcionen ambas credenciales
    if (!email || !contraseña) {
      return NextResponse.json({ error: 'Faltan credenciales: email y contraseña son obligatorias.' }, { status: 400 });
    }

    // Buscar usuario por email en el modelo 'Usuario'
    const usuario = await prisma.usuario.findUnique({
      where: { email }, // Buscar por email
      include: { // Incluir la relación 'roles'
        roles: {
          select: { // Seleccionar solo el campo 'rol' de la tabla intermedia UsuarioRol
            rol: true
          }
        }
      }
    });

    // Verificar si el usuario existe
    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas: Usuario no encontrado o email incorrecto.' }, { status: 401 });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return NextResponse.json({ error: 'Su cuenta está inactiva. Por favor, contacte al administrador.' }, { status: 403 });
    }

    // Comparar la contraseña proporcionada con la hasheada en la base de datos
    const validPassword = await bcrypt.compare(contraseña, usuario.contrasena);
    if (!validPassword) {
      return NextResponse.json({ error: 'Credenciales inválidas: Contraseña incorrecta.' }, { status: 401 });
    }

    // Generar JWT con el ID, cédula, email y roles del usuario como payload
    const token = jwt.sign(
      { userId: usuario.id, cedula: usuario.cedula, email: usuario.email, roles: usuario.roles },
      JWT_SECRET,
      { expiresIn: '1h' } // El token expirará en 1 hora
    );

    // Respuesta exitosa con el token y datos básicos del usuario
    return NextResponse.json({
      token,
      usuario: {
        id: usuario.id,
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
      },
      mensaje: 'Inicio de sesión exitoso.'
    }, { status: 200 });

  } catch (error: unknown) { // Captura el error con tipo 'unknown'
    console.error('Error en login:', error); // Log del error para depuración

    // Manejo específico de errores si es una instancia de Error
    return NextResponse.json(
      {
        error: 'Error interno del servidor al intentar iniciar sesión.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined, // Muestra detalles solo en desarrollo
      },
      { status: 500 }
    );
  }
}
