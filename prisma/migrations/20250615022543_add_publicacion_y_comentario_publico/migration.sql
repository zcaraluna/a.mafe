-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "anonimo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "cedula" TEXT,
ADD COLUMN     "nombre" TEXT,
ADD COLUMN     "status" "CommentStatus" NOT NULL DEFAULT 'PENDIENTE',
ADD COLUMN     "telefono" TEXT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "publicado" BOOLEAN NOT NULL DEFAULT false;
