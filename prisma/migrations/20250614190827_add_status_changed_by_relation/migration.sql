-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_statusChangedBy_fkey" FOREIGN KEY ("statusChangedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
