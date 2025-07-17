import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'clave_super_secreta');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas protegidas
  const protectedRoutes: Record<string, string[]> = {
    '/admin': ['ADMIN'],
    '/empleado': ['EMPLEADO', 'ADMIN'],
    '/cliente': ['CLIENTE', 'EMPLEADO', 'ADMIN'],
  };

  const requiredRoles = Object.entries(protectedRoutes).find(([path]) =>
    pathname.startsWith(path)
  )?.[1];

  if (!requiredRoles) return NextResponse.next();

  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const rol = payload.rol;

    if (!requiredRoles.includes(rol)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    return NextResponse.next();
  } catch (e) {
    console.error('Error al verificar token con jose:', e);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/cliente/:path*', '/empleado/:path*'],
};