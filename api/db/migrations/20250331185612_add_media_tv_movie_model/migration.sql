-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('MOVIE', 'TV', 'BOOK');

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "originalTitle" TEXT,
    "description" TEXT,
    "posterUrl" TEXT,
    "backdropUrl" TEXT,
    "popularity" DOUBLE PRECISION,
    "releaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MovieMetadata" (
    "mediaId" TEXT NOT NULL,
    "adult" BOOLEAN,
    "originalLanguage" TEXT,
    "genres" TEXT[],
    "runtime" INTEGER,
    "rawData" JSONB NOT NULL,

    CONSTRAINT "MovieMetadata_pkey" PRIMARY KEY ("mediaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_externalId_key" ON "Media"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_externalId_mediaType_key" ON "Media"("externalId", "mediaType");

-- CreateIndex
CREATE UNIQUE INDEX "MovieMetadata_mediaId_key" ON "MovieMetadata"("mediaId");

-- AddForeignKey
ALTER TABLE "MovieMetadata" ADD CONSTRAINT "MovieMetadata_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
