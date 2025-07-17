
import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  const cookie = serialize('token', '', {
    httpOnly: true,
    path: '/',
    expires: new Date(0),
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json(
    { mensaje: 'Sesión cerrada' },
    {
      status: 200,
      headers: { 'Set-Cookie': cookie },
    }
  );
}