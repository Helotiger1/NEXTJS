import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { convertirNumeros } from "@/app/lib/axios";


// POST: Registrar un nuevo envío
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const body2 = convertirNumeros(body)
        const {
            tipo,
            almacenOrigen,
            almacenEnvio,
            paquetes
        } = body2;



        const empleadoCedula = 2;
        const estado = 'REGISTRADO';
        const fechaSalida = new Date();
        const fechaLlegada = new Date();
        console.log("📦 Datos recibidos para registrar envío:", body);



        if (!["BARCO", "AVION"].includes(tipo)) {
            return NextResponse.json(
                { success: false, error: "Tipo de envío inválido" },
                { status: 400 }
            );
        }

        if (almacenOrigen === almacenEnvio) {
            return NextResponse.json(
                {
                    success: false,
                    error: "El almacén origen y destino no pueden ser iguales",
                },
                { status: 400 }
            );
        }

        // Validar existencia de almacenes y empleado
        const [origen, destino, empleado] = await Promise.all([
            prisma.almacen.findUnique({ where: { codigo: almacenOrigen } }),
            prisma.almacen.findUnique({ where: { codigo: almacenEnvio} }),
            prisma.usuario.findUnique({ where: {id : empleadoCedula} }),
        ]);

        if (!origen || !destino || !empleado) {
            return NextResponse.json(
                { success: false, error: "Almacén o empleado no encontrado" },
                { status: 404 }
            );
        }





        // Crear el envío y asociar paquetes
        const nuevoEnvio = await prisma.envio.create({
            data: {
                tipo,
                estado,
                fechaSalida,
                fechaLlegada,
                almacenOrigen,
                almacenEnvio,
                empleadoCedula,
                detalleEnvio: {
                    create: paquetes.map((obj) => ({
                        paquete: { connect: { tracking : obj.tracking } },
                    })),
                },
            },
            include: {
                detalleEnvio: true,
            },
        });

        console.log("✅ Envío creado con éxito:", nuevoEnvio);

        return NextResponse.json(
            { success: true, data: nuevoEnvio },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Error al registrar envío:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Error al registrar el envío",
                details:
                    process.env.NODE_ENV === "development"
                        ? (error as Error).message
                        : undefined,
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        // Filtros
        const estado = searchParams.get("estado");
        const empleadoId = searchParams.get("empleadoId");
        const almacenCodigo = searchParams.get("almacenCodigo");
        const clienteOrigenId = searchParams.get("clienteOrigenId");
        const clienteDestinoId = searchParams.get("clienteDestinoId");
        const tracking = searchParams.get("tracking");
        const clienteId = searchParams.get("clienteId");

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

        if (clienteId && !isNaN(Number(clienteId))) {
            where.OR = [
                { clienteOrigenId: Number(clienteId) },
                { clienteDestinoId: Number(clienteId) },
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
        else if (sortField === "almacenCodigo")
            orderBy.almacenCodigo = sortOrder;
        else orderBy.tracking = "asc";

        // 1. Filtro combinado cliente (origen o destino)
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

        // 4. Filtro por estado de factura
        const estadoFactura = searchParams.get("estadoFactura");
        if (estadoFactura) {
            where.detalleFactura = {
                factura: {
                    estado: estadoFactura,
                },
            };
        }

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
                            fechaSalida: "asc",
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
            //orderBy,
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
                        (Date.now() - fechaSalida.getTime()) /
                            (1000 * 60 * 60 * 24)
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
                    tarifaEstimada = Math.max(
                        Math.max(porPeso, porVolumen),
                        45
                    );
                }
            }

            return {
                ...paquete,
                diasTransito,
                tarifaEstimada,
            };
        });

        return NextResponse.json(paquetesEnriquecidos);
    } catch (error: unknown) {
        console.error("Error GET /api/paquetes:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Error al obtener paquetes",
                details:
                    process.env.NODE_ENV === "development"
                        ? (error as Error).message
                        : undefined,
            },
            { status: 500 }
        );
    }
}
