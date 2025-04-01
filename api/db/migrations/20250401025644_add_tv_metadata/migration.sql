-- CreateTable
CREATE TABLE "TvMetadata" (
    "mediaId" TEXT NOT NULL,
    "adult" BOOLEAN,
    "originalLanguage" TEXT,
    "genres" TEXT[],
    "firstAirDate" TIMESTAMP(3),
    "originalCountry" TEXT[],

    CONSTRAINT "TvMetadata_pkey" PRIMARY KEY ("mediaId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TvMetadata_mediaId_key" ON "TvMetadata"("mediaId");

-- AddForeignKey
ALTER TABLE "TvMetadata" ADD CONSTRAINT "TvMetadata_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
