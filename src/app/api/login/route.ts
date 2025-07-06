import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'bece484c8b3add2cfd95c566191cd5daae402865f5654821332d84a8a1e5a928';

export async function POST(req: NextRequest) {
  try {
    const { cedula, contraseña } = await req.json();

    if (!cedula || !contraseña) {
      return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    // Buscar usuario por cédula
    const usuario = await prisma.cliente.findUnique({
      where: { cedula },
    });

    if (!usuario) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    /*
      Validar contraseña:
      Si la contraseña está guardada sin hash, compara directamente (usuario.contraseña !== contraseña).
      Si está hasheada (recomendado), usa bcrypt.compare como se hace aquí.
      Ambos métodos son válidos, pero aquí se utiliza bcrypt para mayor seguridad.

      De todas formas queda pendiente esto a ver cual se usa por facilidad de uso y seguridad.
    */
    const validPassword = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!validPassword) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }
    

    // Generar JWT con la cédula como payload
    const token = jwt.sign({ cedula: usuario.cedula }, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respuesta exitosa con token y datos básicos de usuario
    return NextResponse.json({
      token,
      usuario: {
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
