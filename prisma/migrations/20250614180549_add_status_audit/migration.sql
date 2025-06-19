/*
  Warnings:

  - You are about to drop the column `lastSeenDate` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Report" DROP COLUMN "lastSeenDate",
ADD COLUMN     "statusChangedAt" TIMESTAMP(3),
ADD COLUMN     "statusChangedBy" TEXT;
