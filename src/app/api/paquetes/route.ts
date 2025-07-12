import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import {
    validarMedidas,
    validarEstado,
    validarNumeroPositivo,
    validarTextoNoVacio,
} from "@/app/lib/Validaciones_Paquetes";

import { Prisma, EstadoPaquete as PrismaEstadoPaquete } from "@prisma/client";

// Ya no usas EventoEstado, así que lo eliminé

// POST: Crear nuevo paquete
export async function POST(req: NextRequest) {
    try {
      //esta verga se supone q funciona? le falta el tipo de envio, y en el schema prisma, el estado deberia
      // de ser un default que se vaya actualizando
        const body = await req.json();
        console.log(body);
        const {
            descripcion,
            estado, //este no deberia ir 
            almacenCodigo,
            empleadoCedula,
            alto,
            largo,
            ancho,
            peso,
            origenId,
            destinoId,
            tipoEnvio,
        } = body;

        const medidas = { largo, alto, ancho, peso };

        // Validaciones básicas de los campos
        const validaciones = [
            {
                campo: "descripcion",
                error: validarTextoNoVacio(descripcion, "Descripción"),
            },
            { campo: "estado", error: validarEstado(estado) },
            {
                campo: "almacenCodigo",
                error: validarNumeroPositivo(almacenCodigo, "Almacén"),
            },
            {
                campo: "empleadoCedula",
                error: validarTextoNoVacio(empleadoCedula, "Empleado"),
            },
            { campo: "medidas", error: validarMedidas(medidas) },
            {
                campo: "origenId",
                error: validarNumeroPositivo(origenId, "Origen"),
            },
            {
                campo: "destinoId",
                error: validarNumeroPositivo(destinoId, "Destino"),
            },
        ];

        // Recolectar todos los errores de validación
        const errores = validaciones.filter((v) => v.error).map((v) => v.error);
        if (errores.length > 0) {
            return NextResponse.json(
                { success: false, errors: errores },
                { status: 400 }
            );
        }

        // Verificar relaciones existentes con validación de roles
        const [almacenExiste, usuario, origenExiste, destinoExiste] =
            await Promise.all([
                prisma.almacen.findUnique({ where: { codigo: almacenCodigo } }),
                prisma.usuario.findUnique({
                    where: { cedula: empleadoCedula },
                    include: { roles: true }, // Incluir los roles del usuario
                }),
                prisma.almacen.findUnique({ where: { codigo: origenId } }),
                prisma.almacen.findUnique({ where: { codigo: destinoId } }),
            ]);

        // Validar almacenes
        if (!almacenExiste || !origenExiste || !destinoExiste) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Almacén origen/destino no encontrado",
                },
                { status: 404 }
            );
        }

        // Validar usuario y sus permisos
        if (!usuario) {
            return NextResponse.json(
                { success: false, error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        // Verificar que el usuario tenga rol de EMPLEADO o ADMIN
        const rolesPermitidos = ["EMPLEADO", "ADMIN"];
        const tienePermiso = usuario.roles?.some((r) =>
            rolesPermitidos.includes(r.rol)
        );

        if (!tienePermiso) {
            return NextResponse.json(
                {
                    success: false,
                    error: "El usuario no tiene permisos para registrar paquetes. Se requiere rol EMPLEADO o ADMIN",
                },
                { status: 403 }
            );
        }

        // Crear paquete en transacción
        const nuevoPaquete = await prisma.$transaction(async (prisma) => {
            // Calcular volumen (pulgadas cúbicas)
            const volumen = medidas.largo * medidas.ancho * medidas.alto;

            // 1. Crear las medidas primero
            const medidasCreadas = await prisma.medidas.create({
                data: {
                    largo: medidas.largo,
                    ancho: medidas.ancho,
                    alto: medidas.alto,
                    peso: medidas.peso,
                    volumen,
                },
            });

            // 2. Crear el paquete
            return await prisma.paquete.create({
                data: {
                    descripcion: descripcion.trim(),
                    estado: estado as PrismaEstadoPaquete,
                    almacenCodigo,
                    empleadoCedula,
                    origenId,
                    destinoId,
                    medidasId: medidasCreadas.id,
                },
                include: {
                    almacen: true,
                    empleado: {
                        select: {
                            nombre: true,
                            apellido: true,
                            cedula: true,
                        },
                    },
                    origen: true,
                    destino: true,
                    medidas: true,
                },
            });
        });

        return NextResponse.json(
            { success: true, data: nuevoPaquete },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error POST /api/paquetes:", error);
        return NextResponse.json(
            { success: false, error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}

// GET: Listar paquetes con paginación y filtros
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(
            50,
            Math.max(1, parseInt(searchParams.get("limit") || "10"))
        );
        const estado = searchParams.get("estado");
        const empleado = searchParams.get("empleado");
        const almacen = searchParams.get("almacen");

        const whereClause: Prisma.PaqueteWhereInput = {};

        if (
            estado &&
            Object.values(PrismaEstadoPaquete).includes(
                estado as PrismaEstadoPaquete
            )
        ) {
            whereClause.estado = estado as PrismaEstadoPaquete;
        }

        if (empleado) {
            whereClause.empleadoCedula = empleado;
        }

        if (almacen) {
            const almacenNum = parseInt(almacen);
            if (!isNaN(almacenNum)) whereClause.almacenCodigo = almacenNum;
        }

        const [total, paquetes] = await Promise.all([
            prisma.paquete.count({ where: whereClause }),
            prisma.paquete.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: whereClause,
                include: {
                    almacen: true,
                    empleado: { select: { nombre: true, apellido: true } },
                    origen: true,
                    destino: true,
                },
                orderBy: { tracking: "asc" },
            }),
        ]);

        return NextResponse.json(paquetes);
    } catch (error) {
        console.error("Error GET /api/paquetes:", error);
        return NextResponse.json(
            { success: false, error: "Error al obtener paquetes" },
            { status: 500 }
        );
    }
}
