/*
  Warnings:

  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[cedula]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empleadoCedula` to the `Envio` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `clienteCedula` on the `Factura` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clienteDestinoCedula` to the `Paquete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteOrigenCedula` to the `Paquete` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `empleadoCedula` on the `Paquete` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `usuarioId` on the `UsuarioRol` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Factura" DROP CONSTRAINT "Factura_clienteCedula_fkey";

-- DropForeignKey
ALTER TABLE "Paquete" DROP CONSTRAINT "Paquete_empleadoCedula_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioRol" DROP CONSTRAINT "UsuarioRol_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Envio" ADD COLUMN     "empleadoCedula" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "clienteCedula",
ADD COLUMN     "clienteCedula" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Paquete" ADD COLUMN     "clienteDestinoCedula" INTEGER NOT NULL,
ADD COLUMN     "clienteOrigenCedula" INTEGER NOT NULL,
DROP COLUMN "empleadoCedula",
ADD COLUMN     "empleadoCedula" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UsuarioRol" DROP COLUMN "usuarioId",
ADD COLUMN     "usuarioId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cedula_key" ON "Usuario"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioRol_usuarioId_rol_key" ON "UsuarioRol"("usuarioId", "rol");

-- AddForeignKey
ALTER TABLE "UsuarioRol" ADD CONSTRAINT "UsuarioRol_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_empleadoCedula_fkey" FOREIGN KEY ("empleadoCedula") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_clienteOrigenCedula_fkey" FOREIGN KEY ("clienteOrigenCedula") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_clienteDestinoCedula_fkey" FOREIGN KEY ("clienteDestinoCedula") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Envio" ADD CONSTRAINT "Envio_empleadoCedula_fkey" FOREIGN KEY ("empleadoCedula") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Factura" ADD CONSTRAINT "Factura_clienteCedula_fkey" FOREIGN KEY ("clienteCedula") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
