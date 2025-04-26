-- CreateTable
CREATE TABLE "ActivityTimer" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "activityType" "ActivityType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "mediaId" TEXT,
    "customMediaId" TEXT,
    "languageId" INTEGER NOT NULL,
    "activityId" TEXT,

    CONSTRAINT "ActivityTimer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityTimer_userId_startTime_idx" ON "ActivityTimer"("userId", "startTime");

-- AddForeignKey
ALTER TABLE "ActivityTimer" ADD CONSTRAINT "ActivityTimer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimer" ADD CONSTRAINT "ActivityTimer_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimer" ADD CONSTRAINT "ActivityTimer_customMediaId_fkey" FOREIGN KEY ("customMediaId") REFERENCES "CustomMedia"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimer" ADD CONSTRAINT "ActivityTimer_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityTimer" ADD CONSTRAINT "ActivityTimer_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
