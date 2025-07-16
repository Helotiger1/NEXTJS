/*
  Warnings:

  - Added the required column `tipoEnvio` to the `Paquete` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoEnvio" AS ENUM ('BARCO', 'AVION');

-- AlterTable
ALTER TABLE "Paquete" ADD COLUMN "tipoEnvio" TEXT NOT NULL DEFAULT 'AVION';

