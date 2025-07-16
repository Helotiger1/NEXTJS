//Crear y listar envios
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import {
  validarEstadoEnvio,
  validarFecha,
  validarTextoNoVacio,
  validarTipoEnvio,
  validarNumeroPositivo,
} from '@/app/lib/Validaciones_Envios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tipo,
      estado,
      fechaSalida,
      fechaLlegada,
      almacenOrigen,
      almacenEnvio,
      empleadoCedula,
      paquetes, // array de trackings
    } = body;

    // Validaciones
    const errores = [
      validarTipoEnvio(tipo),
      validarEstadoEnvio(estado),
      validarFecha(fechaSalida, 'fechaSalida'),
      validarFecha(fechaLlegada, 'fechaLlegada'),
      validarNumeroPositivo(almacenOrigen, 'almacenOrigen'),
      validarNumeroPositivo(almacenEnvio, 'almacenEnvio'),
      validarNumeroPositivo(empleadoCedula, 'empleadoCedula'),
    ].filter((e) => e !== null);

    if (!Array.isArray(paquetes) || paquetes.length === 0) {
      errores.push('Debes asociar al menos un paquete.');
    }

    if (errores.length > 0) {
      return NextResponse.json({ success: false, errores }, { status: 400 });
    }

    // Crear el envío
    const nuevoEnvio = await prisma.envio.create({
      data: {
        tipo: tipo.toLowerCase(),
        estado: estado.toLowerCase(),
        fechaSalida: new Date(fechaSalida),
        fechaLlegada: new Date(fechaLlegada),
        almacenOrigen,
        almacenEnvio,
        empleadoCedula,
      },
    });

    // Asociar los paquetes al envío
    for (const tracking of paquetes) {
      await prisma.detalleEnvio.create({
        data: {
          envioNumero: nuevoEnvio.numero,
          paqueteTracking: tracking,
        },
      });
    }

    // Opcional: retornar envío con paquetes
    const envioCompleto = await prisma.envio.findUnique({
      where: { numero: nuevoEnvio.numero },
      include: {
        detalleEnvio: {
          include: { paquete: true },
        },
      },
    });

    return NextResponse.json(
      { success: true, envio: envioCompleto },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al crear envío:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const envios = await prisma.envio.findMany({
      include: {
        detalleEnvio: true,
        Origen: true,
        Envio: true,
        empleado: true,
      },
      orderBy: { fechaSalida: 'desc' },
    });

    return NextResponse.json({ success: true, envios });
  } catch (error) {
    console.error('Error al listar envíos:', error);
    return NextResponse.json(
      { success: false, error: 'No se pudieron obtener los envíos' },
      { status: 500 }
    );
  }
}