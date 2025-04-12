-- CreateTable
CREATE TABLE "CustomMedia" (
    "id" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomMedia_mediaId_key" ON "CustomMedia"("mediaId");

-- CreateIndex
CREATE INDEX "CustomMedia_userId_idx" ON "CustomMedia"("userId");

-- AddForeignKey
ALTER TABLE "CustomMedia" ADD CONSTRAINT "CustomMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomMedia" ADD CONSTRAINT "CustomMedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
