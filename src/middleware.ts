import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'clave_super_secreta';

// Rutas protegidas y roles permitidos
const protectedRoutes: Record<string, string[]> = {
  '/admin': ['ADMIN'],
  '/empleado': ['EMPLEADO', 'ADMIN'],
  '/cliente': ['CLIENTE', 'EMPLEADO', 'ADMIN'],
};

export function middleware(request: NextRequest) {
 /*  const { pathname } = request.nextUrl;


  // Obtener roles requeridos para la ruta actual
  const requiredRoles = Object.entries(protectedRoutes).find(([path]) =>
    pathname.startsWith(path)
  )?.[1];

  if (!requiredRoles) return NextResponse.next();

  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/unathorized', request.url));
  }

  try {
    const payload = jwt.verify(token, SECRET) as {
      email: string;
      roles: string[];
      [key: string]: any;
    };

    // payload.roles es array, chequeamos que alguno esté en roles permitidos
    const tieneRolPermitido = payload.roles.some((rol: string) =>
      requiredRoles.includes(rol)
    );

    if (!tieneRolPermitido) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(new URL('/login', request.url));
  } */
}

export const config = {
  matcher: ['/admin/:path*', '/cliente/:path*', '/empleado/:path*'],
};