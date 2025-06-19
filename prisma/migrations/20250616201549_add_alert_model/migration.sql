-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVA', 'RESUELTA', 'ARCHIVADA');

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "alias" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "genero" TEXT NOT NULL,
    "nacionalidad" TEXT,
    "departamentos" TEXT[],
    "relato" TEXT,
    "motivo" TEXT NOT NULL,
    "estado" "AlertStatus" NOT NULL DEFAULT 'ACTIVA',
    "observacionesInternas" TEXT,
    "altura" DOUBLE PRECISION,
    "peso" DOUBLE PRECISION,
    "colorOjos" TEXT,
    "colorCabello" TEXT,
    "tipoCabello" TEXT,
    "seniasParticulares" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publica" BOOLEAN NOT NULL DEFAULT true,
    "alertId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlertPhoto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlertPhoto" ADD CONSTRAINT "AlertPhoto_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
