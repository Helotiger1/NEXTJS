//ver, aactualizar y eliminar
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import {
  validarEstadoEnvio,
  validarFecha,
  validarTextoNoVacio,
  validarTipoEnvio,
  validarNumeroPositivo,
} from '@/app/lib/Validaciones_Envios';

export async function GET(req: NextRequest, 
  context: { params: { numero: string } }) {
  const {numero}=  await context.params;
  const numeroInt = parseInt(numero);

  if (isNaN(numeroInt)) {
    return NextResponse.json({ success: false, error: 'Número de envío inválido' }, 
    { status: 400 });
  }

  try {
    const envio = await prisma.envio.findUnique({
      where: { numero:numeroInt },
      include: {
        detalleEnvio: {
          include: {
            paquete: {
              include: { medidas: true },
            },
          },
        },
        Origen: true,
        Envio: true,
        empleado: true,
      },
    });

    if (!envio) {
      return NextResponse.json({ success: false, error: 'Envío no encontrado' }, 
      { status: 404 });
    }

    return NextResponse.json({ success: true, envio });
  } catch (error) {
    console.error('Error al obtener envío:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, 
    { status: 500 });
  }
}

export async function PUT(req: NextRequest, 
  context: { params: { numero: string } }) {
  const {numero}=  await context.params;
  const numeroInt = parseInt(numero);
  if (isNaN(numeroInt)) {
    return NextResponse.json({ success: false, error: 'Número de envío inválido' }, 
    { status: 400 });
  }

  const body = await req.json();
  const {
    tipo,
    estado,
    fechaSalida,
    fechaLlegada,
    almacenOrigen,
    almacenEnvio,
    empleadoCedula,
  } = body;

  const errores = [];

  if (tipo) errores.push(validarTipoEnvio(tipo));
  if (estado) errores.push(validarEstadoEnvio(estado));
  if (fechaSalida) errores.push(validarFecha(fechaSalida, 'fechaSalida'));
  if (fechaLlegada) errores.push(validarFecha(fechaLlegada, 'fechaLlegada'));
  if (almacenOrigen) errores.push(validarNumeroPositivo(almacenOrigen, 'almacenOrigen'));
  if (almacenEnvio) errores.push(validarNumeroPositivo(almacenEnvio, 'almacenEnvio'));
  if (empleadoCedula) errores.push(validarNumeroPositivo(empleadoCedula, 'empleadoCedula'));

  const erroresFiltrados = errores.filter((e) => e !== null);
  if (erroresFiltrados.length > 0) {
    return NextResponse.json({ success: false, errores: erroresFiltrados }, 
    { status: 400 });
  }

  try {
    const envioActualizado = await prisma.envio.update({
      where: { numero: numeroInt},
      data: {
        tipo: tipo?.toLowerCase(),
        estado: estado?.toLowerCase(),
        fechaSalida: fechaSalida ? new Date(fechaSalida) : undefined,
        fechaLlegada: fechaLlegada ? new Date(fechaLlegada) : undefined,
        almacenOrigen,
        almacenEnvio,
        empleadoCedula,
      },
    });

    return NextResponse.json({ success: true, envio: envioActualizado });
  } catch (error) {
    console.error('Error al actualizar envío:', error);
    return NextResponse.json({ success: false, error: 'No se pudo actualizar el envío' }, 
    { status: 500 });
  }
}

export async function DELETE(_: NextRequest, 
  context: { params: { numero: string } }) {
    const {numero}=  await context.params;
    const numeroInt = parseInt(numero);

  if (isNaN(numeroInt)) {
    return NextResponse.json({ success: false, error: 'Número de envío inválido' }, 
    { status: 400 });
  }

  try {
    // Primero borrar los detalles
    await prisma.detalleEnvio.deleteMany({
      where: { envioNumero: numeroInt },
    });

    // Luego borrar el envío
    await prisma.envio.delete({
      where: { numero: numeroInt },
    });

    return NextResponse.json({ success: true, mensaje: 'Envío eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar envío:', error);
    return NextResponse.json({ success: false, error: 'No se pudo eliminar el envío' }, 
    { status: 500 });
  }
}