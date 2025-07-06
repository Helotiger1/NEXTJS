import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Rol } from "@prisma/client";
import {
  calcularPieCubico,
  calcularPrecioEnvio,
  generarFactura,
  siguienteEstado,
  PaqueteParaFactura,
} from "@/app/lib/Logica_Negocio";

import {
  validarEstadoFactura,
  validarMetodoPago,
  validarNumeroPositivo,
  validarCantidadPaquetes,
  validarMonto,
} from "@/app/lib/Validaciones_Facturas";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const {
        estado,
        metodoPago,
        envioNumero,
        clienteCedula,
        paquetes, // [{ tracking, largoIn, anchoIn, altoIn, pesoLb, tipoEnvio }]
      } = req.body;

      if (
        !estado ||
        !metodoPago ||
        !envioNumero ||
        !clienteCedula ||
        !Array.isArray(paquetes) ||
        paquetes.length === 0
      ) {
        return res.status(400).json({
          error: "Faltan datos obligatorios o paquetes vacíos",
        });
      }

      const errEstado = validarEstadoFactura(estado);
      if (errEstado) return res.status(400).json({ error: errEstado });

      const errMetodo = validarMetodoPago(metodoPago);
      if (errMetodo) return res.status(400).json({ error: errMetodo });

      const errCantPiezas = validarNumeroPositivo(
        paquetes.length,
        "cantPiezas"
      );
      if (errCantPiezas)
        return res.status(400).json({ error: errCantPiezas });

      const errCantPaquetes = validarCantidadPaquetes(
        paquetes.length,
        paquetes
      );
      if (errCantPaquetes)
        return res.status(400).json({ error: errCantPaquetes });

      const cliente = await prisma.usuario.findUnique({
        where: { cedula: clienteCedula },
        include: { roles: true },
      });
      if (!cliente)
        return res.status(404).json({ error: "Cliente no encontrado" });
      if (!cliente.roles.some((r) => r.rol === Rol.CLIENTE)) {
        return res
          .status(400)
          .json({ error: "Usuario no tiene rol CLIENTE" });
      }

      const envio = await prisma.envio.findUnique({
        where: { numero: envioNumero },
      });
      if (!envio)
        return res.status(404).json({ error: "Envío no encontrado" });

      const paquetesParaFactura: PaqueteParaFactura[] = [];
      for (const p of paquetes) {
        const paqueteDb = await prisma.paquete.findUnique({
          where: { tracking: p.tracking },
          include: { detalleFactura: true },
        });

        if (!paqueteDb)
          return res.status(404).json({
            error: `Paquete ${p.tracking} no encontrado`,
          });

        if (paqueteDb.detalleFactura)
          return res.status(400).json({
            error: `Paquete ${p.tracking} ya asignado a una factura`,
          });

        const pieCubico = calcularPieCubico(
          p.largoIn,
          p.anchoIn,
          p.altoIn
        );

        paquetesParaFactura.push({
          tracking: p.tracking,
          pesoLb: p.pesoLb,
          pieCubico,
          tipoEnvio: p.tipoEnvio,
        });
      }

      const { total, items } = generarFactura(paquetesParaFactura);

      const errMonto = validarMonto(total);
      if (errMonto) return res.status(400).json({ error: errMonto });

      const facturaCreada = await prisma.factura.create({
        data: {
          estado,
          monto: total, // se guarda el total aquí
          metodoPago,
          cantPiezas: paquetes.length,
          envioNumero,
          clienteCedula,
          detalleFactura: {
            create: items.map((item) => ({
              paqueteTracking: item.tracking,
              // monto no se guarda, es derivado
            })),
          },
        },
        include: {
          detalleFactura: true,
        },
      });

      for (const p of paquetes) {
        await prisma.paquete.update({
          where: { tracking: p.tracking },
          data: {
            estado: siguienteEstado("recibido en almacén", "registrar"),
          },
        });
      }

      return res.status(201).json(facturaCreada);
    } catch (error) {
      console.error("Error creando factura:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor" });
    }
  }

  // -----------------------------------------------------------------------
  else if (req.method === "GET") {
    try {
      const facturas = await prisma.factura.findMany({
        include: {
          detalleFactura: {
            include: {
              paquete: {
                include: {
                  medidas: true,
                },
              },
            },
          },
        },
      });

      const facturasConMontos = facturas.map((factura) => ({
        ...factura,
        detalleFactura: factura.detalleFactura.map((detalle) => {
          const paquete = detalle.paquete;
          const medidas = paquete?.medidas;

          const pieCubico = medidas
            ? calcularPieCubico(
                medidas.largo,
                medidas.ancho,
                medidas.alto
              )
            : 0;

          const montoCalculado = paquete
            ? calcularPrecioEnvio(
                paquete.estado === "barco" ? "barco" : "avion",
                medidas?.peso ?? 0,
                pieCubico
              )
            : 0;

          return {
            numero: detalle.numero,
            facturaNumero: detalle.facturaNumero,
            paqueteTracking: detalle.paqueteTracking,
            montoCalculado,
          };
        }),
      }));

      return res.status(200).json(facturasConMontos);
    } catch (error) {
      console.error("Error obteniendo facturas:", error);
      return res
        .status(500)
        .json({ error: "Error interno del servidor" });
    }
  }

  // -----------------------------------------------------------------------
  else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res
      .status(405)
      .json({ error: `Método ${req.method} no permitido` });
  }
}
