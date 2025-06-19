-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reporterName" TEXT NOT NULL,
    "reporterLastName" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reporterBirthDate" TIMESTAMP(3) NOT NULL,
    "reporterMaritalStatus" TEXT NOT NULL,
    "reporterGender" TEXT NOT NULL,
    "reporterPhone" TEXT NOT NULL,
    "reporterAddress" TEXT NOT NULL,
    "reporterLat" DOUBLE PRECISION,
    "reporterLng" DOUBLE PRECISION,
    "reporterIdFront" TEXT NOT NULL,
    "reporterIdBack" TEXT NOT NULL,
    "reporterIp" TEXT NOT NULL,
    "missingName" TEXT NOT NULL,
    "missingLastName" TEXT NOT NULL,
    "missingBirthDate" TIMESTAMP(3) NOT NULL,
    "missingId" TEXT,
    "missingGender" TEXT NOT NULL,
    "missingPhone" TEXT,
    "missingPhotos" TEXT[],
    "disappearanceStory" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
