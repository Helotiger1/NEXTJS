import { NextRequest, NextResponse } from 'next/server'
import prisma from '@lib/prisma'
import { validarTelefono, validarDireccion } from '@lib/Validaciones_Almacenes'

// GET - Obtener un almacén específico
export async function GET(req: NextRequest, { params }: { params: { codigo: string } }) {
  try {
    // Desestructurar params primero
    const { codigo: codigoStr } = params;
    console.log(`[ALMACEN-GET] Solicitando almacén con código: ${codigoStr}`);
    
    const codigo = parseInt(codigoStr);
    
    if (isNaN(codigo)) {
      console.log('[ALMACEN-GET] Error: Código de almacén inválido');
      return NextResponse.json(
        { success: false, error: "Código de almacén inválido" },
        { status: 400 }
      );
    }

    const almacen = await prisma.almacen.findUnique({
      where: { codigo },
      include: {
        direccion: true,
        _count: {
          select: {
            paquetes: true,
            origenEnvios: true,
            destinoEnvios: true
          }
        }
      }
    });

    if (!almacen) {
      console.log('[ALMACEN-GET] Error: Almacén no encontrado');
      return NextResponse.json(
        { success: false, error: "Almacén no encontrado" },
        { status: 404 }
      );
    }

    console.log('[ALMACEN-GET] Almacén encontrado:', {
      id: almacen.codigo,
      codigo: almacen.codigo
    });

    return NextResponse.json({
      success: true,
      data: {
        ...almacen,
        paquetesEnAlmacen: almacen._count.paquetes,
        enviosOrigen: almacen._count.origenEnvios,
        enviosDestino: almacen._count.destinoEnvios
      }
    });

  } catch (error) {
    console.error('[ALMACEN-GET] Error al obtener almacén:', error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar almacén 
export async function PUT(request: NextRequest,{ params }: { params: { codigo: string } }) {
  try {
    // Desestructurar params primero
    const { codigo: codigoStr } = params;
    console.log(`[ALMACEN-PUT] Iniciando actualización para código: ${codigoStr}`);
    
    // Validar y parsear código
    const codigo = parseInt(codigoStr);
    if (isNaN(codigo)) {
      const errorMsg = "El código de almacén debe ser un número válido";
      console.log(`[ALMACEN-PUT] ${errorMsg}`);
      return NextResponse.json(
        { 
          success: false,
          error: errorMsg,
          details: [{
            campo: "codigo",
            valorRecibido: codigoStr,
            mensaje: errorMsg
          }]
        },
        { status: 400 }
      );
    }

    // Obtener y validar datos del body
    const requestData = await request.json();
    console.log('[ALMACEN-PUT] Datos recibidos del frontend:', JSON.stringify(requestData, null, 2));

    // Validar estructura básica
    if (!requestData || (typeof requestData !== 'object')) {
      const errorMsg = "El cuerpo de la solicitud debe ser un objeto JSON válido";
      console.log(`[ALMACEN-PUT] ${errorMsg}`);
      return NextResponse.json(
        { 
          success: false,
          error: errorMsg,
          details: []
        },
        { status: 400 }
      );
    }

    // Validar datos con estructura detallada de errores
    const errores: Array<{
      campo: string;
      valorRecibido?: string | number | object | null;
      mensaje: string;
    }> = [];

    // Validar teléfono si está presente
    if (requestData.telefono !== undefined) {
      if (typeof requestData.telefono !== 'string') {
        errores.push({
          campo: "telefono",
          valorRecibido: requestData.telefono,
          mensaje: "El teléfono debe ser una cadena de texto"
        });
      } else {
        const erroresTelefono = validarTelefono(requestData.telefono);
        errores.push(...erroresTelefono.map(error => ({
          campo: "telefono",
          valorRecibido: requestData.telefono,
          mensaje: error
        })));
      }
    }

    // Validar dirección si está presente
    if (requestData.direccion !== undefined) {
      if (typeof requestData.direccion !== 'object' || requestData.direccion === null) {
        errores.push({
          campo: "direccion",
          valorRecibido: requestData.direccion,
          mensaje: "La dirección debe ser un objeto válido"
        });
      } else {
        // Validar campos de dirección
        const erroresDireccion = validarDireccion(requestData.direccion);
        errores.push(...erroresDireccion.map(error => {
          const campo = error.includes("linea1") ? "direccion.linea1" : 
                      error.includes("pais") ? "direccion.pais" :
                      error.includes("estado") ? "direccion.estado" :
                      error.includes("ciudad") ? "direccion.ciudad" :
                      error.includes("codigoPostal") ? "direccion.codigoPostal" : "direccion";
          
          return {
            campo,
            valorRecibido: requestData.direccion[campo.split('.').pop() || ''],
            mensaje: error
          };
        }));

        // Validación adicional para código postal
        if (requestData.direccion.codigoPostal && isNaN(parseInt(requestData.direccion.codigoPostal))) {
          errores.push({
            campo: "direccion.codigoPostal",
            valorRecibido: requestData.direccion.codigoPostal,
            mensaje: "El código postal debe ser un número válido"
          });
        }
      }
    }

    // Si hay errores, retornarlos
    if (errores.length > 0) {
      console.log('[ALMACEN-PUT] Errores de validación:', JSON.stringify(errores, null, 2));
      return NextResponse.json(
        { 
          success: false,
          error: "Error de validación en los datos",
          details: errores,
          message: "Por favor corrige los siguientes campos: " + 
                  errores.map(e => e.campo).join(", ")
        },
        { status: 400 }
      );
    }

    // Preparar datos para actualización
    const datosActualizacion: {
      telefono?: string;
      direccion?: {
        linea1?: string;
        linea2?: string;
        pais?: string;
        estado?: string;
        ciudad?: string;
        codigoPostal?: number;
      };
    } = {};

    if (requestData.telefono !== undefined) {
      datosActualizacion.telefono = requestData.telefono.toString();
    }

    if (requestData.direccion) {
      datosActualizacion.direccion = {
        linea1: requestData.direccion.linea1,
        linea2: requestData.direccion.linea2,
        pais: requestData.direccion.pais,
        estado: requestData.direccion.estado,
        ciudad: requestData.direccion.ciudad,
        codigoPostal: requestData.direccion.codigoPostal ? parseInt(requestData.direccion.codigoPostal) : undefined
      };
    }

    // Actualización transaccional
    console.log('[ALMACEN-PUT] Iniciando transacción de actualización...');
    const almacenActualizado = await prisma.$transaction(async (tx) => {
      console.log('[ALMACEN-PUT] Buscando almacén existente...');
      const almacenExistente = await tx.almacen.findUnique({
        where: { codigo },
        include: { direccion: true }
      });

      if (!almacenExistente) {
        const errorMsg = `Almacén con código ${codigo} no encontrado`;
        console.log(`[ALMACEN-PUT] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      console.log(`[ALMACEN-PUT] Almacén encontrado: ${almacenExistente.codigo}`);

      // Actualizar dirección si se proporciona
      if (datosActualizacion.direccion) {
        console.log('[ALMACEN-PUT] Actualizando dirección...');
        await tx.direccion.update({
          where: { id: almacenExistente.direccionId },
          data: {
            linea1: datosActualizacion.direccion.linea1 ?? almacenExistente.direccion.linea1,
            linea2: datosActualizacion.direccion.linea2 ?? almacenExistente.direccion.linea2,
            pais: datosActualizacion.direccion.pais ?? almacenExistente.direccion.pais,
            estado: datosActualizacion.direccion.estado ?? almacenExistente.direccion.estado,
            ciudad: datosActualizacion.direccion.ciudad ?? almacenExistente.direccion.ciudad,
            codigoPostal: datosActualizacion.direccion.codigoPostal ?? almacenExistente.direccion.codigoPostal
          }
        });
        console.log('[ALMACEN-PUT] Dirección actualizada');
      }

      // Actualizar teléfono si se proporciona
      if (datosActualizacion.telefono !== undefined) {
        console.log('[ALMACEN-PUT] Actualizando teléfono...');
        return await tx.almacen.update({
          where: { codigo },
          data: { telefono: datosActualizacion.telefono },
          include: { direccion: true }
        });
      }

      return almacenExistente;
    });

    console.log('[ALMACEN-PUT] Actualización completada exitosamente');
    return NextResponse.json({
      success: true,
      data: almacenActualizado,
      message: "Almacén actualizado correctamente"
    });

  } catch (error) {
    console.error('[ALMACEN-PUT] Error en la actualización:', error);
    
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    const errorDetails = process.env.NODE_ENV === 'development' ? 
      (error instanceof Error ? error.stack : undefined) :
      undefined;

    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: errorDetails,
        message: "Ocurrió un error al actualizar el almacén"
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar almacén (con validación de relaciones)
export async function DELETE(req: NextRequest, { params }: { params: { codigo: string } }) {
  try {
    // Desestructurar params primero
    const { codigo: codigoStr } = params;
    console.log(`[ALMACEN-DELETE] Iniciando eliminación para código: ${codigoStr}`);
    
    const codigo = parseInt(codigoStr);
    console.log('[ALMACEN-DELETE] Código recibido:', codigoStr, '-> Parseado:', codigo);

    if (isNaN(codigo)) {
      console.log('[ALMACEN-DELETE] Error: Código de almacén inválido');
      return NextResponse.json(
        { success: false, error: "Código de almacén inválido" },
        { status: 400 }
      );
    }

    // Verificar relaciones activas
    console.log('[ALMACEN-DELETE] Verificando relaciones activas...')
    const relaciones = await prisma.$transaction([
      prisma.paquete.count({ where: { OR: [
        { origenId: codigo },
        { destinoId: codigo }
      ] }}),
      prisma.envio.count({ where: { OR: [
        { almacenOrigen: codigo },
        { almacenEnvio: codigo }
      ] }})
    ])

    const [totalPaquetes, totalEnvios] = relaciones
    console.log('[ALMACEN-DELETE] Relaciones encontradas:', {
      paquetes: totalPaquetes,
      envios: totalEnvios
    })

    if (totalPaquetes > 0 || totalEnvios > 0) {
      console.log('[ALMACEN-DELETE] Error: Relaciones activas encontradas')
      return NextResponse.json(
        { 
          success: false,
          error: "No se puede eliminar el almacén porque tiene relaciones activas",
          details: {
            paquetesRelacionados: totalPaquetes,
            enviosRelacionados: totalEnvios
          }
        },
        { status: 400 }
      )
    }

    // Eliminar en transacción
    console.log('[ALMACEN-DELETE] Iniciando transacción de eliminación...')
    await prisma.$transaction(async (tx) => {
      console.log('[ALMACEN-DELETE] Buscando almacén para eliminar...')
      const almacen = await tx.almacen.findUnique({
        where: { codigo },
        select: { direccionId: true }
      })

      if (!almacen) {
        console.log('[ALMACEN-DELETE] Error: Almacén no encontrado')
        throw new Error("Almacén no encontrado")
      }

      console.log('[ALMACEN-DELETE] Eliminando almacén...')
      await tx.almacen.delete({ where: { codigo } })
      console.log('[ALMACEN-DELETE] Eliminando dirección asociada...')
      await tx.direccion.delete({ where: { id: almacen.direccionId } })
    })

    console.log('[ALMACEN-DELETE] Eliminación completada para código:', codigo)
    return NextResponse.json({
      success: true,
      message: "Almacén eliminado correctamente"
    })

  } catch (error) {
    console.error('[ALMACEN-DELETE] Error en la eliminación:', error);
    return NextResponse.json(
      { 
        success: false,
        error: typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Error interno del servidor"
          : "Error interno del servidor"
      },
      { status: 500 }
    );
  }
}