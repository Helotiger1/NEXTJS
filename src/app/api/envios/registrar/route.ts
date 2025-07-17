import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";


// POST: Registrar un nuevo envío
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            tipo,
            almacenOrigen,
            almacenEnvio,
            paquetes
        } = body;


        const empleadoCedula = 4;
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
            prisma.almacen.findUnique({ where: { codigo: almacenEnvio } }),
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
        const estado = "REGISTRADO";

        const where: Prisma.PaqueteWhereInput = {};

        if (estado ) {
            where.estado = estado
        }

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
        });

        const paquetesEnriquecidos = paquetes.map((paquete) => {
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
