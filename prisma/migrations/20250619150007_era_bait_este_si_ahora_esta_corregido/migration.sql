/*
  Warnings:

  - A unique constraint covering the columns `[medidasId]` on the table `Paquete` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `medidasId` to the `Paquete` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DetalleEnvio_envioNumero_key";

-- DropIndex
DROP INDEX "DetalleEnvio_paqueteTracking_key";

-- DropIndex
DROP INDEX "DetalleFactura_facturaNumero_key";

-- AlterTable
ALTER TABLE "Paquete" ADD COLUMN     "medidasId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Paquete_medidasId_key" ON "Paquete"("medidasId");

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_medidasId_fkey" FOREIGN KEY ("medidasId") REFERENCES "Medidas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
