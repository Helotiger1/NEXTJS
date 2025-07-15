import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { Prisma } from '@prisma/client';


function validarFecha(fecha: string, campo: string): string | null {
  if (!fecha || isNaN(Date.parse(fecha))) {
    return `Fecha ${campo} inválida. Formato esperado: YYYY-MM-DD o ISO.`;
  }
  return null;
}

function validarNumeroPositivo(numero: number, campo: string): string | null {
  if (typeof numero !== 'number' || isNaN(numero) || numero <= 0) {
    return `El campo '${campo}' debe ser un número entero positivo.`;
  }
  return null;
}

function validarTipoEnvio(tipo: string): string | null {
  const tiposValidos = ["barco", "avion"];
  if (!tipo || !tiposValidos.includes(tipo.toLowerCase())) {
    return `Tipo de envío inválido. Debe ser: ${tiposValidos.join(", ")}.`;
  }
  return null;
}

function validarEstadoEnvio(estado: string): string | null {
  const estadosValidos = ["en puerto de salida", "en transito", "en destino"];
  if (!estado || !estadosValidos.includes(estado.toLowerCase())) {
    return `Estado de envío inválido. Debe ser: ${estadosValidos.join(", ")}.`;
  }
  return null;
}


// Interfaz para el cuerpo de PUT
interface EnvioBody {
  tipo?: string;
  estado?: string;
  fechaSalida?: string;
  fechaLlegada?: string;
 
  empleadoId?: number; //
  paquetes?: number[]; // Array de tracking numbers de paquetes para reemplazar
}

// GET: Obtener un envío por su número
export async function GET(_req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const numero = parseInt(params.numero);
    if (isNaN(numero) || numero <= 0) { // Validación de número positivo
      return NextResponse.json({ error: 'Número de envío inválido.' }, { status: 400 });
    }

    const envio = await prisma.envio.findUnique({
      where: { numero },
      include: {
        Origen: true, // Incluye la información del almacén de origen
        Envio: true,  // Incluye la información del almacén de destino
        empleado: {   // Incluye la información del empleado
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            roles: { select: { rol: true } },
          },
        },
        detalleEnvio: { // Incluye los detalles de envío y los paquetes asociados
          include: { paquete: true },
        },
        facturas: true, // Incluye las facturas asociadas
      },
    });

    if (!envio) {
      return NextResponse.json({ error: 'Envío no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(envio);
  } catch (error: unknown) { // Manejo de errores con tipo 'unknown'
    console.error('Error al obtener el envío:', error);
    return NextResponse.json(
      {
        error: 'Error interno del servidor al obtener el envío.',
        details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}

// PUT: Actualizar un envío por número
export async function PUT(req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const numero = parseInt(params.numero);
    if (isNaN(numero) || numero <= 0) {
      return NextResponse.json({ error: 'Número de envío inválido.' }, { status: 400 });
    }

    const body: EnvioBody = await req.json();

    const envioExistente = await prisma.envio.findUnique({
      where: { numero },

    });
    if (!envioExistente) {
      return NextResponse.json({ error: 'Envío no encontrado.' }, { status: 404 });
    }

    // Validar que al menos un campo de actualización esté presente
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron datos para actualizar el envío.' }, { status: 400 });
    }

    // Objeto para almacenar los datos a actualizar
    const dataActualizar: Prisma.EnvioUpdateInput = {};
    const erroresValidacion: string[] = [];

    // Validaciones y asignaciones para los campos opcionales del PUT
    if (body.tipo !== undefined) {
      const error = validarTipoEnvio(body.tipo);
      if (error) erroresValidacion.push(error);
      else dataActualizar.tipo = body.tipo.toLowerCase();
    }

    if (body.estado !== undefined) {
      const error = validarEstadoEnvio(body.estado);
      if (error) erroresValidacion.push(error);
      else dataActualizar.estado = body.estado.toLowerCase();
    }

    if (body.fechaSalida !== undefined) {
      const error = validarFecha(body.fechaSalida, 'fechaSalida');
      if (error) erroresValidacion.push(error);
      else dataActualizar.fechaSalida = new Date(body.fechaSalida);
    }

    if (body.fechaLlegada !== undefined) {
      const error = validarFecha(body.fechaLlegada, 'fechaLlegada');
      if (error) erroresValidacion.push(error);
      else {
        const nuevaFechaLlegada = new Date(body.fechaLlegada);
        // Validar que fechaLlegada no sea anterior a fechaSalida
        // Ahora accedemos a envioExistente.fechaSalida directamente
        if (envioExistente.fechaSalida && nuevaFechaLlegada < envioExistente.fechaSalida) {
          erroresValidacion.push("La fecha de llegada no puede ser anterior a la fecha de salida del envío.");
        } else {
          dataActualizar.fechaLlegada = nuevaFechaLlegada;
        }
      }
    }

    // Validar y asignar empleadoId
    if (body.empleadoId !== undefined) {
      const error = validarNumeroPositivo(body.empleadoId, 'empleadoId');
      if (error) erroresValidacion.push(error);
      else {
      
        const empleado = await prisma.usuario.findUnique({ where: { id: body.empleadoId, roles: { some: { rol: "EMPLEADO" } } } });
        if (!empleado) erroresValidacion.push('Empleado no existe o no tiene el rol de EMPLEADO.');
        else {
          dataActualizar.empleado = {
            connect: { id: empleado.id } // Conectar por el ID del Usuario
          };
        }
      }
    }

    // Si hay errores de validación, devolverlos
    if (erroresValidacion.length > 0) {
      return NextResponse.json({ errors: erroresValidacion }, { status: 400 });
    }

    // Usar una transacción para asegurar la atomicidad de la actualización del envío y sus paquetes
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Actualizar datos del envío
      const envioActualizado = await tx.envio.update({
        where: { numero },
        data: dataActualizar,
      });

      
      if (body.paquetes !== undefined) {
        if (
          !Array.isArray(body.paquetes) ||
          !body.paquetes.every((t: number) => typeof t === 'number' && Number.isInteger(t) && t > 0)
        ) {
          return NextResponse.json({ error: 'El campo "paquetes" debe ser un arreglo de IDs de paquete válidos y positivos.' }, { status: 400 });
        }

        // Verificar que todos los tracking numbers de los paquetes existan
        const paquetesDB = await tx.paquete.findMany({
          where: { tracking: { in: body.paquetes } }
        });

        if (paquetesDB.length !== body.paquetes.length) {
          const foundTrackings = new Set(paquetesDB.map(p => p.tracking));
          const missingTrackings = body.paquetes.filter(tracking => !foundTrackings.has(tracking));
          return NextResponse.json({ error: `Uno o más paquetes no existen: ${missingTrackings.join(', ')}.` }, { status: 400 });
        }

        // Eliminar todas las relaciones de paquetes anteriores para este envío
        await tx.detalleEnvio.deleteMany({ where: { envioNumero: numero } });

        // Insertar las nuevas relaciones de paquetes
        await tx.detalleEnvio.createMany({
          data: body.paquetes.map(tracking => ({
            envioNumero: numero,
            paqueteTracking: tracking,
          })),
        });
      }

      return envioActualizado;
    });

    return NextResponse.json({
      mensaje: 'Envío actualizado correctamente',
      envio: result,
    });

  } catch (error: unknown) { // Manejo de errores con tipo 'unknown'
    console.error('Error actualizando envío:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Violación de restricción única
        return NextResponse.json(
          { error: `Conflicto de datos: ${error.meta?.target || 'Registro duplicado'}. Asegúrate de que los valores de almacén de origen/destino no estén ya en uso por otro envío (si son únicos).` },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') { // Error de clave foránea
        return NextResponse.json(
          { error: "Error de datos relacionados. Asegúrate de que los almacenes, empleado o paquetes existen." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor al actualizar el envío.',
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}


export async function DELETE(_req: NextRequest, { params }: { params: { numero: string } }) {
  try {
    const numero = parseInt(params.numero);
    if (isNaN(numero) || numero <= 0) {
      return NextResponse.json({ error: 'Número de envío inválido.' }, { status: 400 });
    }

    const envio = await prisma.envio.findUnique({ where: { numero } });
    if (!envio) {
      return NextResponse.json({ error: 'Envío no encontrado.' }, { status: 404 });
    }

    // Usar una transacción para asegurar la atomicidad de la eliminación
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
     
      await tx.detalleEnvio.deleteMany({ where: { envioNumero: numero } });

      await tx.envio.delete({ where: { numero } });
    });


    return NextResponse.json({ mensaje: 'Envío eliminado correctamente.' });
  } catch (error: unknown) { // Manejo de errores con tipo 'unknown'
    console.error('Error eliminando envío:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') { // Error de clave foránea 
        return NextResponse.json(
          { error: "No se puede eliminar el envío. Puede que existan otras relaciones que lo impidan (ej. facturas pendientes)." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor al eliminar el envío.',
        details: process.env.NODE_ENV === "development" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
