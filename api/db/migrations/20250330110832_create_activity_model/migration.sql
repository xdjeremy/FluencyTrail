-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('WATCHING', 'READING', 'LISTENING', 'GRAMMAR', 'VOCABULARY', 'WRITING', 'PLAYING', 'OTHER');

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "notes" TEXT,
    "duration" INTEGER,
    "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
