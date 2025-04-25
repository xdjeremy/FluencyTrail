-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_customMediaId_fkey";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_customMediaId_fkey" FOREIGN KEY ("customMediaId") REFERENCES "CustomMedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
