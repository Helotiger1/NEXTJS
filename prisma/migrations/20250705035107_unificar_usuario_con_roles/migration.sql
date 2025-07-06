/*
  Warnings:

  - You are about to drop the `Cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Empleado` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CLIENTE', 'EMPLEADO', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_clienteCedula_fkey";

-- DropForeignKey
ALTER TABLE "Paquete" DROP CONSTRAINT "Paquete_empleadoCedula_fkey";

-- DropIndex
DROP INDEX "Factura_clienteCedula_key";

-- DropIndex
DROP INDEX "Paquete_empleadoCedula_key";

-- DropTable
DROP TABLE "Cliente";

-- DropTable
DROP TABLE "Empleado";

-- CreateTable
CREATE TABLE "Usuario" (
    "cedula" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("cedula")
);

-- CreateTable
CREATE TABLE "UsuarioRol" (
    "id" SERIAL NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,

    CONSTRAINT "UsuarioRol_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_usuarioId_rol_key" ON "UsuarioRol"("usuarioId", "rol");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_empleadoCedula_fkey" FOREIGN KEY ("empleadoCedula") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteCedula_fkey" FOREIGN KEY ("clienteCedula") REFERENCES "Usuario"("cedula") ON DELETE RESTRICT ON UPDATE CASCADE;
