/*
  Warnings:

  - Added the required column `apellido` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Made the column `nacionalidad` on table `Alert` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NivelPeligrosidad" AS ENUM ('BAJO', 'MEDIO', 'ALTO', 'EXTREMO');

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "documentoIdentidad" TEXT,
ADD COLUMN     "motivoOrdenCaptura" TEXT,
ADD COLUMN     "nivelPeligrosidad" "NivelPeligrosidad" NOT NULL DEFAULT 'MEDIO',
ADD COLUMN     "publicadaEn" TIMESTAMP(3),
ADD COLUMN     "publicadaPorId" TEXT,
ADD COLUMN     "fotoPrincipal" TEXT,
ALTER COLUMN "nacionalidad" SET NOT NULL,
ALTER COLUMN "nacionalidad" SET DEFAULT 'Paraguaya';

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_publicadaPorId_fkey" FOREIGN KEY ("publicadaPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
