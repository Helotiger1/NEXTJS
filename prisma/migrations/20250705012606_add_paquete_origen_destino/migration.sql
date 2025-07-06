/*
  Warnings:

  - Added the required column `destinoId` to the `Paquete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origenId` to the `Paquete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Paquete" ADD COLUMN     "destinoId" INTEGER NOT NULL,
ADD COLUMN     "origenId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_origenId_fkey" FOREIGN KEY ("origenId") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paquete" ADD CONSTRAINT "Paquete_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "Almacen"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;
