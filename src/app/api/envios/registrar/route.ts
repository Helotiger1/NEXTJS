import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";


// Validaciones para el modelo Envio
function validarTipoEnvio(tipo: string): string | null {
  const tiposValidos = ["barco", "avion"]; // Definir los tipos de envío válidos
  if (!tipo || !tiposValidos.includes(tipo.toLowerCase())) {
    return `Tipo de envío inválido. Debe ser: ${tiposValidos.join(", ")}.`;
  }
  return null;
}

function validarEstadoEnvio(estado: string): string | null {
  const estadosValidos = ["en puerto de salida", "en transito", "en destino"]; // Definir los estados de envío válidos
  if (!estado || !estadosValidos.includes(estado.toLowerCase())) {
    return `Estado de envío inválido. Debe ser: ${estadosValidos.join(", ")}.`;
  }
  return null;
}

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

// Interfaz para tipar el objeto paquete en calcularCostoEnvio
interface PaqueteParaCosto {
  tracking: number;
  medidas: {
    largo: number;
    ancho: number;
    alto: number;
    peso: number;
    volumen: number;
  } | null; // Puede ser null si la relación no se carga
}

// Función auxiliar para calcular el costo del envío
function calcularCostoEnvio(paquete: PaqueteParaCosto, tipoEnvio: 'barco' | 'avion'): number {
  if (!paquete || !paquete.medidas) {
    console.warn("Advertencia: Paquete o sus medidas son indefinidas para calcular costo.");
    return 0;
  }
  const volumenPiesCubicos =
    (paquete.medidas.largo * paquete.medidas.ancho * paquete.medidas.alto) /
    1728; // Conversión de cm³ a ft³

  if (tipoEnvio.toLowerCase() === "barco") {
    return Math.max(volumenPiesCubicos * 25, 35); // Costo mínimo de 35
  } else if (tipoEnvio.toLowerCase() === "avion") {
    const porPeso = paquete.medidas.peso * 7;
    const porVolumen = volumenPiesCubicos * 7;
    return Math.max(Math.max(porPeso, porVolumen), 45); // Costo mínimo de 45
  }
  return 0; // Tipo de envío no válido
}


// Interfaz para el cuerpo de la solicitud POST al crear un envío
interface CreateEnvioBody {
  tipo: string;
  estado: string;
  fechaSalida: string;
  fechaLlegada: string;
  almacenOrigen: number;
  almacenEnvio: number;
  paquetes: number[]; // Array de tracking numbers de paquetes a asociar
  clienteCedula: string; // Cédula del cliente para la factura
  empleadoId: number;
}


interface UpdateEnvioBody {
  numero: number;
  estado?: string;
  fechaLlegada?: string;
  empleadoId?: number; // Ahora se espera el ID del empleado
}


// POST: Crear un nuevo envío
export async function POST(req: NextRequest) {
  try {
    const body: EnvioBody = await req.json();

    // Validaciones básicas
    const errores = [
      validarTipoEnvio(body.tipo),
      validarEstadoEnvio(body.estado),
      validarFecha(body.fechaSalida, "fechaSalida"),
      validarFecha(body.fechaLlegada, "fechaLlegada"),
      validarNumeroPositivo(body.almacenOrigen, "almacenOrigen"),
      validarNumeroPositivo(body.almacenEnvio, "almacenEnvio"),
      validarNumeroPositivo(body.empleadoId, "empleadoId"),
    ].filter((error): error is string => error !== null); // Filtra los nulls y tip

    if (erroresValidacion.length > 0) {
      return NextResponse.json({ errors: erroresValidacion }, { status: 400 });
    }

    // Validar fechas coherentes
    const parsedFechaSalida = new Date(body.fechaSalida);
    const parsedFechaLlegada = new Date(body.fechaLlegada);
    if (parsedFechaLlegada < parsedFechaSalida) {
      return NextResponse.json(
        { error: "La fecha de llegada no puede ser anterior a la fecha de salida." },
        { status: 400 }
      );
    }

    // Validar paquetes: debe ser un array de números enteros positivos
    if (!Array.isArray(body.paquetes) || body.paquetes.length === 0 || !body.paquetes.every(t => typeof t === 'number' && Number.isInteger(t) && t > 0)) {
      return NextResponse.json(
        { error: "El campo 'paquetes' debe ser un arreglo de IDs de paquete válidos y positivos." },
        { status: 400 }
      );
    }

    const [origen, destino, empleado, cliente] = await Promise.all([
      prisma.almacen.findUnique({ where: { codigo: body.almacenOrigen } }),
      prisma.almacen.findUnique({ where: { codigo: body.almacenEnvio } }),
      prisma.usuario.findUnique({ where: { id: body.empleadoId, roles: { some: { rol: "EMPLEADO" } } } }),
      prisma.usuario.findUnique({ where: { cedula: body.clienteCedula, roles: { some: { rol: "CLIENTE" } } } })
    ]);

    if (!origen) {
      return NextResponse.json({ error: "Almacén de origen no encontrado." }, { status: 404 });
    }
    if (!destino) {
      return NextResponse.json({ error: "Almacén de destino no encontrado." }, { status: 404 });
    }
    if (!empleado) {
      return NextResponse.json({ error: "Empleado no encontrado o no tiene el rol de EMPLEADO." }, { status: 404 });
    }
    if (!cliente) {
      return NextResponse.json({ error: "Cliente no encontrado o no tiene el rol de CLIENTE." }, { status: 404 });
    }

    // Asegurarse de que todos los paquetes existen y obtener sus datos
    const paquetesExistentes = await prisma.paquete.findMany({
      where: { tracking: { in: body.paquetes } },
      include: { medidas: true }
    });

    if (paquetesExistentes.length !== body.paquetes.length) {
      const foundTrackings = new Set(paquetesExistentes.map((p) => p.tracking));
      const missingTrackings = body.paquetes.filter(tracking => !foundTrackings.has(tracking));
      return NextResponse.json(
        { error: `Uno o más paquetes no existen: ${missingTrackings.join(', ')}.` },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Crear el envío
      const nuevoEnvio = await tx.envio.create({
        data: {
          tipo: body.tipo.toLowerCase(),
          estado: body.estado.toLowerCase(),
          fechaSalida: parsedFechaSalida,
          fechaLlegada: parsedFechaLlegada,
          almacenOrigen: body.almacenOrigen,
          almacenEnvio: body.almacenEnvio,
          empleadoCedula: empleado.id, // Asignar el ID numérico del empleado
          detalleEnvio: {
            create: body.paquetes.map(tracking => ({ paqueteTracking: tracking })),
          },
        },
        include: {
          detalleEnvio: {
            include: { paquete: true },
          },
        },
      });

      // Actualizar estado de los paquetes
      await tx.paquete.updateMany({
        where: { tracking: { in: body.paquetes } },
        data: { estado: "EN_TRANSITO" },
      });

      // Calcular costos y crear factura
      const detallesFactura = await Promise.all(
        paquetesExistentes.map(async (paquete) => {
          const costo = calcularCostoEnvio(paquete, body.tipo as 'barco' | 'avion');
          return {
            paqueteTracking: paquete.tracking,
            monto: costo
          };
        })
      );

      const montoTotal = detallesFactura.reduce((sum, detalle) => sum + detalle.monto, 0);

      await tx.factura.create({
        data: {
          estado: "GENERADO", // Estado inicial de la factura
          monto: montoTotal,
          metodoPago: "PENDIENTE", // Método de pago inicial
          cantPiezas: body.paquetes.length,
          envioNumero: nuevoEnvio.numero,
          clienteCedula: cliente.id, // Asignar el ID numérico del cliente
          detalleFactura: {
            create: detallesFactura
          }
        }
      });

      return nuevoEnvio;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creando envío:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Violación de restricción única
        return NextResponse.json(
          { error: `Conflicto de datos: ${error.meta?.target || 'Registro duplicado'}. Asegúrate de que los almacenes no estén ya en uso por otro envío (debido a la restricción UNIQUE en tu schema).` },
          { status: 409 }
        );
      }
      if (error.code === 'P2003') { // Error de clave foránea
        return NextResponse.json(
          { error: "Error de datos relacionados. Asegúrate de que el cliente, empleado o almacenes existen." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error interno del servidor al crear el envío." },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar envío
export async function PATCH(req: NextRequest) {
  try {
    const { numero, ...data }: UpdateEnvioBody = await req.json();

    // Validar que 'numero' sea un número válido y positivo
    if (typeof numero !== 'number' || isNaN(numero) || numero <= 0) {
      return NextResponse.json({ error: 'Número de envío inválido para actualizar.' }, { status: 400 });
    }

    // Validar que al menos un campo de actualización esté presente
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No se proporcionaron datos para actualizar el envío.' }, { status: 400 });
    }

    // Validar que el envío existe
    const envioExistente = await prisma.envio.findUnique({
      where: { numero },
      include: { detalleEnvio: true }, // Incluir detalleEnvio para la lógica de paquetes
    });

    if (!envioExistente) {
      return NextResponse.json(
        { error: "Envío no encontrado." },
        { status: 404 }
      );
    }

    // Objeto para almacenar los datos a actualizar en Prisma
    const dataActualizar: Prisma.EnvioUpdateInput = {};
    const erroresValidacion: string[] = [];

    // Validaciones y asignaciones para los campos opcionales del PATCH
    if (data.estado !== undefined) {
      const error = validarEstadoEnvio(data.estado);
      if (error) erroresValidacion.push(error);
      else dataActualizar.estado = data.estado.toLowerCase();
    }

    if (data.fechaLlegada !== undefined) {
      const error = validarFecha(data.fechaLlegada, "fechaLlegada");
      if (error) erroresValidacion.push(error);
      else {
        const nuevaFechaLlegada = new Date(data.fechaLlegada);
        if (envioExistente.fechaSalida && nuevaFechaLlegada < envioExistente.fechaSalida) {
          erroresValidacion.push("La fecha de llegada no puede ser anterior a la fecha de salida del envío.");
        } else {
          dataActualizar.fechaLlegada = nuevaFechaLlegada;
        }
      }
    }

    if (data.empleadoId !== undefined) { // Ahora se espera empleadoId
      const error = validarNumeroPositivo(data.empleadoId, 'empleadoId'); // Validar empleadoId
      if (error) erroresValidacion.push(error);
      else {
        const empleado = await prisma.usuario.findUnique({ where: { id: data.empleadoId, roles: { some: { rol: "EMPLEADO" } } } }); // Buscar por ID
        if (!empleado) erroresValidacion.push('Empleado no existe o no tiene el rol de EMPLEADO.');
        else {
          dataActualizar.empleado = {
            connect: { id: empleado.id } // Conectar por el ID del Usuario
          };
        }
      }
    }

    if (erroresValidacion.length > 0) {
      return NextResponse.json({ errors: erroresValidacion }, { status: 400 });
    }

    // Actualizar envío en una transacción para asegurar la consistencia
    const envioActualizado = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const updatedEnvio = await tx.envio.update({
        where: { numero },
        data: dataActualizar,
      });

      // Si el estado cambió a "en destino", actualizar paquetes a "EN_ALMACEN"
      if (data.estado?.toLowerCase() === "en destino") {
        const paquetesIds = envioExistente.detalleEnvio.map(d => d.paqueteTracking);
        await tx.paquete.updateMany({
          where: { tracking: { in: paquetesIds } },
          data: { estado: "EN_ALMACEN" },
        });

        await tx.factura.updateMany({
          where: { envioNumero: numero },
          data: { estado: "PENDIENTE_PAGO" }
        });
      }
      return updatedEnvio;
    });

    return NextResponse.json(envioActualizado);
  } catch (error: unknown) {
    console.error("Error actualizando envío:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET: Listar paquetes con paginación y filtros
export async function GET(req: NextRequest) {
  try {
        //En vista de que se rompio, procedere a meter cualquier mamada aqui.
    return NextResponse.json( [
  {
    tracking: "123456789",
    descripcion: "Paquete de documentos importantes",
    origen: "California",
    destino: "Doral",
    peso: "2 kg",
    alto: "10 cm",
    largo: "30 cm",
    volumen: "0.003 m³",
    fecha: "2025-07-10",
    cedulaOrigen: 3141414,
    cedulaDestino : 4314144
  },
  {
    tracking: "987654321",
    descripcion: "Componentes electrónicos",
    origen: "Shanghai, China",
    destino: "Caracas, Venezuela",
    peso: "15 kg",
    alto: "40 cm",
    largo: "60 cm",
    volumen: "0.096 m³",
    fecha: "2025-07-08",
  },
  {
    tracking: "112233445",
    descripcion: "Muestra de tela",
    origen: "Madrid, España",
    destino: "Maracaibo, Venezuela",
    peso: "0.5 kg",
    alto: "5 cm",
    largo: "20 cm",
    volumen: "0.001 m³",
    fecha: "2025-07-11",
  },
  {
    tracking: "556677889",
    descripcion: "Libros y material de estudio",
    origen: "Bogotá, Colombia",
    destino: "Valencia, Venezuela",
    peso: "8 kg",
    alto: "25 cm",
    largo: "45 cm",
    volumen: "0.028 m³",
    fecha: "2025-07-09",
  },
]);
    const { searchParams } = new URL(req.url);

    // Filtros
    const estado = searchParams.get("estado");
    const empleadoId = searchParams.get("empleadoId");
    const almacenCodigo = searchParams.get("almacenCodigo");
    const clienteOrigenId = searchParams.get("clienteOrigenId");
    const clienteDestinoId = searchParams.get("clienteDestinoId");
    const tracking = searchParams.get("tracking");

    // Ordenamiento (opcional)
    const sortField = searchParams.get("sort") || "tracking";
    const sortOrder = searchParams.get("order") === "asc" ? "asc" : "desc";

    // Construir cláusula WHERE
    const where: Prisma.PaqueteWhereInput = {};

    if (estado && validarEstadoPaqueteString(estado)) {
      where.estado = estado as EstadoPaquete;
    }

    if (empleadoId && !isNaN(Number(empleadoId))) {
      where.empleadoId = Number(empleadoId);
    }

    if (almacenCodigo && !isNaN(Number(almacenCodigo))) {
      where.OR = [
        { almacenCodigo: Number(almacenCodigo) },
        { origenId: Number(almacenCodigo) },
        { destinoId: Number(almacenCodigo) },
      ];
    }

    if (clienteOrigenId && !isNaN(Number(clienteOrigenId))) {
      where.clienteOrigenId = Number(clienteOrigenId);
    }

    if (clienteDestinoId && !isNaN(Number(clienteDestinoId))) {
      where.clienteDestinoId = Number(clienteDestinoId);
    }

    if (tracking && !isNaN(Number(tracking))) {
      where.tracking = Number(tracking);
    }

    // Construir ORDER BY
    const orderBy: Prisma.PaqueteOrderByWithRelationInput = {};
    if (sortField === "tracking") orderBy.tracking = sortOrder;
    else if (sortField === "estado") orderBy.estado = sortOrder;
    else if (sortField === "almacenCodigo") orderBy.almacenCodigo = sortOrder;
    else orderBy.tracking = "desc";

    // 1. Filtro combinado cliente (origen o destino)
    const clienteId = searchParams.get("clienteId");
    if (clienteId && !isNaN(Number(clienteId))) {
      where.OR = [
        { clienteOrigenId: Number(clienteId) },
        { clienteDestinoId: Number(clienteId) },
      ];
    }

    /*/ 2. Filtro por fechas
    const fechaInicio = searchParams.get("fechaInicio");
    const fechaFin = searchParams.get("fechaFin");
    if (fechaInicio || fechaFin) {
      where.fechaRegistro = {};
      if (fechaInicio) where.fechaRegistro.gte = new Date(fechaInicio);
      if (fechaFin) where.fechaRegistro.lte = new Date(fechaFin);
    }*/

    // 3. Filtro por tipo de envío
    const tipoEnvio = searchParams.get("tipoEnvio");
    if (tipoEnvio) {
      where.detalleEnvio = {
        some: {
          envio: {
            tipo: tipoEnvio,
          },
        },
      };
    }

    /*/ 4. Filtro por estado de factura
    const estadoFactura = searchParams.get("estadoFactura");
    if (estadoFactura) {
      where.detalleFactura = {
        some: {
          factura: {
            estado: estadoFactura,
          },
        },
      };
    }*/

    // Obtener todos los paquetes con relaciones completas
    const paquetes = await prisma.paquete.findMany({
      where,
      include: {
        almacen: {
          include: {
            direccion: true,
          },
        },
        empleado: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
            roles: {
              select: {
                rol: true,
              },
            },
          },
        },
        origen: {
          include: {
            direccion: true,
          },
        },
        destino: {
          include: {
            direccion: true,
          },
        },
        medidas: true,
        clienteOrigen: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        clienteDestino: {
          select: {
            id: true,
            cedula: true,
            nombre: true,
            apellido: true,
            email: true,
            telefono: true,
          },
        },
        detalleEnvio: {
          include: {
            envio: {
              include: {
                Origen: {
                  include: {
                    direccion: true,
                  },
                },
                Envio: {
                  include: {
                    direccion: true,
                  },
                },
                empleado: {
                  select: {
                    nombre: true,
                    apellido: true,
                  },
                },
              },
            },
          },
          orderBy: {
            envio: {
              fechaSalida: "desc",
            },
          },
        },
        detalleFactura: {
          include: {
            factura: {
              include: {
                cliente: true,
              },
            },
          },
        },
      },
      orderBy,
    });

    // Enriquecer los datos con información calculada
    const paquetesEnriquecidos = paquetes.map((paquete) => {
      // Calcular días en tránsito si aplica
      let diasTransito = null;
      let envioActual = null;

      if (paquete.detalleEnvio.length > 0) {
        envioActual = paquete.detalleEnvio[0].envio;

        if (envioActual?.fechaSalida) {
          const fechaSalida = new Date(envioActual.fechaSalida);
          diasTransito = Math.floor(
            (Date.now() - fechaSalida.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
      }

      // Calcular tarifa estimada
      let tarifaEstimada = null;
      if (envioActual) {
        const volumenPiesCubicos =
          (paquete.medidas.largo *
            paquete.medidas.ancho *
            paquete.medidas.alto) /
          1728;

        if (envioActual.tipo === "MARITIMO") {
          tarifaEstimada = Math.max(volumenPiesCubicos * 25, 35);
        } else if (envioActual.tipo === "AEREO") {
          const porPeso = paquete.medidas.peso * 7;
          const porVolumen = volumenPiesCubicos * 7;
          tarifaEstimada = Math.max(Math.max(porPeso, porVolumen), 45);
        }
      }

      return {
        ...paquete,
        diasTransito,
        tarifaEstimada,
      };
    });

    return NextResponse.json({
      success: true,
      data: paquetesEnriquecidos,
    });
  } catch (error: unknown) {
    console.error("Error GET /api/paquetes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar el envío." },
      { status: 500 }
    );
  }
}
