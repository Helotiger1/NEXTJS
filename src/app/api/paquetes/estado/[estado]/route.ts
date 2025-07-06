// src/app/api/paquetes/estado/[estado]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { EstadoPaquete } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // 1. Extraer el parámetro de estado de la URL
    const estado = request.nextUrl.pathname.split('/').pop();

    // 2. Validar que el parámetro existe
    if (!estado) {
      return NextResponse.json(
        { success: false, error: "Se requiere el parámetro de estado en la URL" },
        { status: 400 }
      );
    }

    // 3. Normalizar el estado a mayúsculas
    const estadoNormalizado = estado.toUpperCase();

    // 4. Definir estados válidos
    const estadosValidos: EstadoPaquete[] = [
      'REGISTRADO',
      'EN_TRANSITO',
      'EN_ALMACEN',
      'ENTREGADO',
      'CANCELADO'
    ];

    // 5. Validar que el estado es permitido
    if (!estadosValidos.includes(estadoNormalizado as EstadoPaquete)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Estado no válido. Valores permitidos: ${estadosValidos.join(', ')}`
        },
        { status: 400 }
      );
    }

    // 6. Consultar paquetes con el estado especificado
    const paquetes = await prisma.paquete.findMany({
      where: { 
        estado: estadoNormalizado as EstadoPaquete
      },
      include: {
        medidas: true,
        empleado: {
          select: {
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true
          }
        },
        origen: {
          select: {
            codigo: true,
            telefono: true,
            direccion: {
              select: {
                linea1: true,
                linea2: true,
                ciudad: true,
                estado: true,
                pais: true,
                codigoPostal: true
              }
            }
          }
        },
        destino: {
          select: {
            codigo: true,
            telefono: true,
            direccion: {
              select: {
                linea1: true,
                linea2: true,
                ciudad: true,
                estado: true,
                pais: true,
                codigoPostal: true
              }
            }
          }
        },
        almacen: {
          select: {
            codigo: true,
            telefono: true,
            direccion: {
              select: {
                linea1: true,
                linea2: true,
                ciudad: true,
                estado: true,
                pais: true,
                codigoPostal: true
              }
            }
          }
        }
      },
      orderBy: {
        tracking: 'desc'
      }
    });

    // 7. Retornar respuesta exitosa
    return NextResponse.json({ 
      success: true, 
      data: paquetes 
    });

  } catch (error) {
    // 8. Manejo de errores
    console.error('Error en GET /api/paquetes/estado/[estado]:', error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}