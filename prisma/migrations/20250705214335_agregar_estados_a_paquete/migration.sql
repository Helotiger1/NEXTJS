/*
  Warnings:

  - Changed the type of `estado` on the `Paquete` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EstadoPaquete" AS ENUM ('REGISTRADO', 'EN_TRANSITO', 'EN_ALMACEN', 'ENTREGADO', 'CANCELADO');

-- AlterTable
ALTER TABLE "Paquete" DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoPaquete" NOT NULL;
