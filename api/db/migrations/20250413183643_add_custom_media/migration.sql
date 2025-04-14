-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "customMediaId" TEXT;

-- CreateTable
CREATE TABLE "CustomMedia" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "CustomMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomMedia_userId_title_key" ON "CustomMedia"("userId", "title");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_customMediaId_fkey" FOREIGN KEY ("customMediaId") REFERENCES "CustomMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMedia" ADD CONSTRAINT "CustomMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
