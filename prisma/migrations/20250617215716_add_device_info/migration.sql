-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "deviceType" TEXT,
ADD COLUMN     "isProxy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "reporterDeviceType" TEXT,
ADD COLUMN     "reporterIsProxy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reporterUserAgent" TEXT;
