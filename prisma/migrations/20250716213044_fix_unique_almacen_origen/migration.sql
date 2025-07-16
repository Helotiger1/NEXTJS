/*
  Warnings:

  - The `tipoEnvio` column on the `Paquete` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Envio_almacenEnvio_key";

-- DropIndex
DROP INDEX "Envio_almacenOrigen_key";

-- AlterTable
ALTER TABLE "Paquete" DROP COLUMN "tipoEnvio",
ADD COLUMN     "tipoEnvio" "TipoEnvio" NOT NULL DEFAULT 'AVION';
