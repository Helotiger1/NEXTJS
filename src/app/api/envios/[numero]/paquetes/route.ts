//asociar y listar paquetes asociados xdd
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(req: NextRequest, 
  context: { params: { numero: string } }) {
  const {numero}=  await context.params;
  const numeroInt = parseInt(numero);

  if (isNaN(numeroInt)) {
    return NextResponse.json({ success: false, error: 'Número de envío inválido' }, 
    { status: 400 });
  }

  try {
    // Buscar paquetes asociados al envío
    const detalleEnvio = await prisma.detalleEnvio.findMany({
      where: { envioNumero: numeroInt },
      include: {
        paquete: {
          include: { medidas: true, origen: true, destino: true, clienteOrigen: true, clienteDestino: true },
        },
      },
    });

    const paquetes = detalleEnvio.map(d => d.paquete);

    return NextResponse.json({ success: true, paquetes });
  } catch (error) {
    console.error('Error al obtener paquetes del envío:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, 
    { status: 500 });
  }
}

export async function POST(req: NextRequest, 
  context: { params: { numero: string } }) {
  const {numero}=  await context.params;
  const numeroInt = parseInt(numero);

  if (isNaN(numeroInt)) {
    return NextResponse.json({ success: false, error: 'Número de envío inválido' }, 
    { status: 400 });
  }

  try {
    const body = await req.json();
    const { paquetes } = body;

    if (!Array.isArray(paquetes) || paquetes.length === 0) {
      return NextResponse.json({ success: false, error: 'Debe enviar un arreglo de IDs de paquetes' }, 
    { status: 400 });
    }

    // Validar que los paquetes existen y no estén ya asociados a este envío
    const paquetesExistentes = await prisma.paquete.findMany({
      where: { tracking: { in: paquetes } },
      select: { tracking: true },
    });

    const existentesTracking = paquetesExistentes.map(p => p.tracking);
    const paquetesNoEncontrados = paquetes.filter((id: number) => !existentesTracking.includes(id));

    if (paquetesNoEncontrados.length > 0) {
        return NextResponse.json(
        { success: false, error: `Paquetes no encontrados: ${paquetesNoEncontrados.join(', ')}` }, 
        { status: 404 });
    }

    // Insertar solo los paquetes que no estén ya asociados a este envío
    const paquetesYaAsociados = await prisma.detalleEnvio.findMany({
      where: {
        envioNumero: numeroInt,
        paqueteTracking: { in: paquetes },
      },
      select: { paqueteTracking: true },
    });

    const yaAsociadosTracking = paquetesYaAsociados.map(p => p.paqueteTracking);
    const paquetesParaAsociar = paquetes.filter((id: number) => !yaAsociadosTracking.includes(id));

    if (paquetesParaAsociar.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Todos los paquetes ya están asociados a este envío' }, 
        { status: 400 });
    }

    // Crear asociaciones en detalleEnvio
    const creados = await Promise.all(
      paquetesParaAsociar.map((tracking: number) =>
        prisma.detalleEnvio.create({
          data: {
            envioNumero: numeroInt,
            paqueteTracking: tracking,
          },
        })
      )
    );

    return NextResponse.json({ success: true, asociados: creados.length });
  } catch (error) {
    console.error('Error al asociar paquetes:', error);
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, 
    { status: 500 });
  }
}