/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Report_code_key" ON "Report"("code");
