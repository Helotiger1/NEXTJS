/*
  Warnings:

  - Changed the type of `monto` on the `Factura` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Factura" DROP COLUMN "monto",
ADD COLUMN     "monto" DOUBLE PRECISION NOT NULL;
