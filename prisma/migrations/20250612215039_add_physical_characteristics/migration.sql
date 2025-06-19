/*
  Warnings:

  - You are about to drop the column `disappearanceStory` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `missingId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `missingPhone` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `missingPhotos` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterBirthDate` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterGender` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterId` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterIdBack` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterIdFront` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterIp` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterLat` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterLng` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `reporterMaritalStatus` on the `Report` table. All the data in the column will be lost.
  - The `status` column on the `Report` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "disappearanceStory",
DROP COLUMN "missingId",
DROP COLUMN "missingPhone",
DROP COLUMN "missingPhotos",
DROP COLUMN "reporterBirthDate",
DROP COLUMN "reporterGender",
DROP COLUMN "reporterId",
DROP COLUMN "reporterIdBack",
DROP COLUMN "reporterIdFront",
DROP COLUMN "reporterIp",
DROP COLUMN "reporterLat",
DROP COLUMN "reporterLng",
DROP COLUMN "reporterMaritalStatus",
ADD COLUMN     "eyeColor" TEXT,
ADD COLUMN     "hairColor" TEXT,
ADD COLUMN     "hairLength" TEXT,
ADD COLUMN     "hairType" TEXT,
ADD COLUMN     "missingClothing" TEXT,
ADD COLUMN     "missingDescription" TEXT,
ADD COLUMN     "missingHeight" DOUBLE PRECISION,
ADD COLUMN     "missingLastLocation" TEXT,
ADD COLUMN     "missingLastSeen" TIMESTAMP(3),
ADD COLUMN     "missingWeight" DOUBLE PRECISION,
ADD COLUMN     "otherFeatures" TEXT,
ADD COLUMN     "reporterCity" TEXT,
ADD COLUMN     "reporterEmail" TEXT,
ADD COLUMN     "reporterState" TEXT,
ADD COLUMN     "reporterZipCode" TEXT,
ADD COLUMN     "skinColor" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "reporterAddress" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
