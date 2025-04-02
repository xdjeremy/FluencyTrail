-- AlterTable
ALTER TABLE "TvMetadata" ADD COLUMN     "lastAirDate" TIMESTAMP(3),
ADD COLUMN     "numberOfEpisodes" INTEGER,
ADD COLUMN     "numberOfSeasons" INTEGER,
ADD COLUMN     "status" TEXT;
