import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  validarFecha,
  validarEstadoEnvio,
  validarTipoEnvio,
  validarNumeroPositivo,
} from '@/app/lib/Validaciones_Envios';

const prisma = new PrismaClient();

// Interfaz opcional para tipar el cuerpo de PUT
interface EnvioBody {
  tipo?: string;
  estado?: string;
  fechaSalida?: string;
  fechaLlegada?: string;
  almacenOrigen?: number;
  almacenEnvio?: number;
  paquetes?: number[];
}

// GET: Obtener un envío por su número
export async function GET(_req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const numero = parseInt(params.numero);
    if (isNaN(numero)) {
      return NextResponse.json({ error: 'Número de envío inválido' }, { status: 400 });
    }

    const envio = await prisma.envio.findUnique({
      where: { numero },
      include: {
        Origen: true,
        Envio: true,
        detalleEnvio: {
          include: { paquete: true },
        },
        facturas: true,
      },
    });

    if (!envio) {
      return NextResponse.json({ error: 'Envío no encontrado' }, { status: 404 });
    }

    return NextResponse.json(envio);
  } catch (error) {
    console.error('Error al obtener el envío:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT: Actualizar un envío por número
export async function PUT(req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const numero = parseInt(params.numero);
    if (isNaN(numero)) {
      return NextResponse.json({ error: 'Número de envío inválido' }, { status: 400 });
    }

    const body: EnvioBody = await req.json();

    const envioExistente = await prisma.envio.findUnique({ where: { numero } });
    if (!envioExistente) {
      return NextResponse.json({ error: 'Envío no encontrado' }, { status: 404 });
    }

    // Tipado explícito para evitar 'any'
    const dataActualizar: Partial<{
      tipo: string;
      estado: string;
      fechaSalida: Date;
      fechaLlegada: Date;
      almacenOrigen: number;
      almacenEnvio: number;
    }> = {};

    // Validaciones y asignaciones
    if (body.tipo) {
      const error = validarTipoEnvio(body.tipo);
      if (error) return NextResponse.json({ error }, { status: 400 });
      dataActualizar.tipo = body.tipo.toLowerCase();
    }

    if (body.estado) {
      const error = validarEstadoEnvio(body.estado);
      if (error) return NextResponse.json({ error }, { status: 400 });
      dataActualizar.estado = body.estado.toLowerCase();
    }

    if (body.fechaSalida) {
      const error = validarFecha(body.fechaSalida, 'fechaSalida');
      if (error) return NextResponse.json({ error }, { status: 400 });
      dataActualizar.fechaSalida = new Date(body.fechaSalida);
    }

    if (body.fechaLlegada) {
      const error = validarFecha(body.fechaLlegada, 'fechaLlegada');
      if (error) return NextResponse.json({ error }, { status: 400 });
      dataActualizar.fechaLlegada = new Date(body.fechaLlegada);
    }

    if (body.almacenOrigen) {
      const error = validarNumeroPositivo(body.almacenOrigen, 'almacenOrigen');
      if (error) return NextResponse.json({ error }, { status: 400 });

      const origen = await prisma.almacen.findUnique({ where: { codigo: body.almacenOrigen } });
      if (!origen) return NextResponse.json({ error: 'Almacén origen no existe' }, { status: 400 });

      dataActualizar.almacenOrigen = body.almacenOrigen;
    }

    if (body.almacenEnvio) {
      const error = validarNumeroPositivo(body.almacenEnvio, 'almacenEnvio');
      if (error) return NextResponse.json({ error }, { status: 400 });

      const destino = await prisma.almacen.findUnique({ where: { codigo: body.almacenEnvio } });
      if (!destino) return NextResponse.json({ error: 'Almacén destino no existe' }, { status: 400 });

      dataActualizar.almacenEnvio = body.almacenEnvio;
    }

    // Actualizar datos del envío
    const envioActualizado = await prisma.envio.update({
      where: { numero },
      data: dataActualizar,
    });

    // Si vienen nuevos paquetes, actualizamos el detalleEnvio
    if (body.paquetes && Array.isArray(body.paquetes)) {
      if (
        body.paquetes.length === 0 ||
        !body.paquetes.every((t: number) => Number.isInteger(t) && t > 0)
      ) {
        return NextResponse.json({ error: 'El campo "paquetes" debe ser un arreglo de IDs válidos' }, { status: 400 });
      }

      const paquetesDB = await prisma.paquete.findMany({
        where: { tracking: { in: body.paquetes } }
      });

      if (paquetesDB.length !== body.paquetes.length) {
        return NextResponse.json({ error: 'Uno o más paquetes no existen' }, { status: 400 });
      }

      // Eliminar paquetes anteriores del envío
      await prisma.detalleEnvio.deleteMany({ where: { envioNumero: numero } });

      // Insertar los nuevos
      await prisma.detalleEnvio.createMany({
        data: body.paquetes.map(tracking => ({
          envioNumero: numero,
          paqueteTracking: tracking,
        })),
      });
    }

    return NextResponse.json({
      mensaje: 'Envío actualizado correctamente',
      envio: envioActualizado,
    });

  } catch (error) {
    console.error('Error actualizando envío:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar un envío y sus relaciones
export async function DELETE(_req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const numero = parseInt(params.numero);
    if (isNaN(numero)) {
      return NextResponse.json({ error: 'Número de envío inválido' }, { status: 400 });
    }

    const envio = await prisma.envio.findUnique({ where: { numero } });
    if (!envio) {
      return NextResponse.json({ error: 'Envío no encontrado' }, { status: 404 });
    }

    // Eliminar relaciones antes de eliminar el envío
    await prisma.detalleEnvio.deleteMany({ where: { envioNumero: numero } });

    await prisma.envio.delete({ where: { numero } });

    return NextResponse.json({ mensaje: 'Envío eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando envío:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
