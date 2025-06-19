/*
  Warnings:

  - You are about to drop the `Note` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Note";

-- CreateTable
CREATE TABLE "Almacen" (
    "codigo" SERIAL NOT NULL,
    "telefono" INTEGER NOT NULL,
    "direccionId" INTEGER NOT NULL,

    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("codigo")
);

-- CreateTable
CREATE TABLE "Direccion" (
    "id" SERIAL NOT NULL,
    "linea1" TEXT NOT NULL,
    "linea2" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "codigoPostal" INTEGER NOT NULL,

    CONSTRAINT "Direccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paquete" (
    "tracking" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "almacenCodigo" INTEGER NOT NULL,
    "empleadoCedula" TEXT NOT NULL,

    CONSTRAINT "Paquete_pkey" PRIMARY KEY ("tracking")
);

-- CreateTable
CREATE TABLE "Medidas" (
    "id" SERIAL NOT NULL,
    "largo" INTEGER NOT NULL,
    "ancho" INTEGER NOT NULL,
    "alto" INTEGER NOT NULL,
    "peso" INTEGER NOT NULL,
    "volumen" INTEGER NOT NULL,

    CONSTRAINT "Medidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetalleEnvio" (
    "id" SERIAL NOT NULL,
    "paqueteTracking" INTEGER NOT NULL,
    "envioNumero" INTEGER NOT NULL,

    CONSTRAINT "DetalleEnvio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,
    "contraseña" TEXT NOT NULL,
    "esAdm" BOOLEAN NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" INTEGER NOT NULL,
    "contraseña" TEXT NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "Envio" (
    "numero" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fechaSalida" TIMESTAMP(3) NOT NULL,
    "fechaLlegada" TIMESTAMP(3) NOT NULL,
    "almacenOrigen" INTEGER NOT NULL,
    "almacenEnvio" INTEGER NOT NULL,

    CONSTRAINT "Envio_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "Factura" (
    "numero" SERIAL NOT NULL,
    "estado" TEXT NOT NULL,
    "monto" TEXT NOT NULL,
    "metodoPago" TEXT NOT NULL,
    "cantPiezas" INTEGER NOT NULL,
    "envioNumero" INTEGER NOT NULL,
    "clienteCedula" TEXT NOT NULL,

    CONSTRAINT "Factura_pkey" PRIMARY KEY ("numero")
);

-- CreateTable
CREATE TABLE "DetalleFactura" (
    "numero" SERIAL NOT NULL,
    "facturaNumero" INTEGER NOT NULL,
    "paqueteTracking" INTEGER NOT NULL,

    CONSTRAINT "DetalleFactura_pkey" PRIMARY KEY ("numero")
);

-- CreateIndex
CREATE UNIQUE INDEX "Almacen_direccionId_key" ON "Almacen"("direccionId");

-- CreateIndex
CREATE UNIQUE INDEX "Paquete_empleadoCedula_key" ON "Paquete"("empleadoCedula");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleEnvio_paqueteTracking_key" ON "DetalleEnvio"("paqueteTracking");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleEnvio_envioNumero_key" ON "DetalleEnvio"("envioNumero");

-- CreateIndex
CREATE UNIQUE INDEX "Envio_almacenOrigen_key" ON "Envio"("almacenOrigen");

-- CreateIndex
CREATE UNIQUE INDEX "Envio_almacenEnvio_key" ON "Envio"("almacenEnvio");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_envioNumero_key" ON "Factura"("envioNumero");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_clienteCedula_key" ON "Factura"("clienteCedula");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleFactura_facturaNumero_key" ON "DetalleFactura"("facturaNumero");

-- CreateIndex
CREATE UNIQUE INDEX "DetalleFactura_paqueteTracking_key" ON "DetalleFactura"("paqueteTracking");

-- AddForeignKey
ALTER TABLE "Almacen" ADD CONSTRAINT "Almacen_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "Direccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_empleadoCedula_fkey" FOREIGN KEY ("empleadoCedula") REFERENCES "Empleado"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_almacenCodigo_fkey" FOREIGN KEY ("almacenCodigo") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEnvio" ADD CONSTRAINT "DetalleEnvio_paqueteTracking_fkey" FOREIGN KEY ("paqueteTracking") REFERENCES "Paquete"("tracking") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleEnvio" ADD CONSTRAINT "DetalleEnvio_envioNumero_fkey" FOREIGN KEY ("envioNumero") REFERENCES "Envio"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_almacenOrigen_fkey" FOREIGN KEY ("almacenOrigen") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_almacenEnvio_fkey" FOREIGN KEY ("almacenEnvio") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteCedula_fkey" FOREIGN KEY ("clienteCedula") REFERENCES "Cliente"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_envioNumero_fkey" FOREIGN KEY ("envioNumero") REFERENCES "Envio"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_facturaNumero_fkey" FOREIGN KEY ("facturaNumero") REFERENCES "Factura"("numero") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleFactura" ADD CONSTRAINT "DetalleFactura_paqueteTracking_fkey" FOREIGN KEY ("paqueteTracking") REFERENCES "Paquete"("tracking") ON DELETE RESTRICT ON UPDATE CASCADE;
