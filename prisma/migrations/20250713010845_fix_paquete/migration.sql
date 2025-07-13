/*
  Warnings:

  - You are about to drop the column `clienteDestinoCedula` on the `Paquete` table. All the data in the column will be lost.
  - You are about to drop the column `clienteOrigenCedula` on the `Paquete` table. All the data in the column will be lost.
  - You are about to drop the column `empleadoCedula` on the `Paquete` table. All the data in the column will be lost.
  - Added the required column `clienteDestinoId` to the `Paquete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteOrigenId` to the `Paquete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empleadoId` to the `Paquete` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Paquete" DROP CONSTRAINT "Paquete_clienteDestinoCedula_fkey";

-- DropForeignKey
ALTER TABLE "Paquete" DROP CONSTRAINT "Paquete_clienteOrigenCedula_fkey";

-- DropForeignKey
ALTER TABLE "Paquete" DROP CONSTRAINT "Paquete_empleadoCedula_fkey";

-- AlterTable
ALTER TABLE "Paquete" DROP COLUMN "clienteDestinoCedula",
DROP COLUMN "clienteOrigenCedula",
DROP COLUMN "empleadoCedula",
ADD COLUMN     "clienteDestinoId" INTEGER NOT NULL,
ADD COLUMN     "clienteOrigenId" INTEGER NOT NULL,
ADD COLUMN     "empleadoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_clienteOrigenId_fkey" FOREIGN KEY ("clienteOrigenId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_clienteDestinoId_fkey" FOREIGN KEY ("clienteDestinoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
