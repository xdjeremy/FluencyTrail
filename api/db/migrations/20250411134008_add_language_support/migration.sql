-- CreateTable
CREATE TABLE "Language" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");

-- AlterTable: User - Add language relations (nullable initially)
ALTER TABLE "User"
    ADD COLUMN "primaryLanguageId" INTEGER,
    ALTER COLUMN "timezone" SET NOT NULL;

-- AlterTable: Activity - Add language relation (nullable initially)
ALTER TABLE "Activity"
    ADD COLUMN "languageId" INTEGER,
    ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable: _LanguageToUser (many-to-many join table)
CREATE TABLE "_LanguageToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LanguageToUser_AB_unique" ON "_LanguageToUser"("A", "B");
CREATE INDEX "_LanguageToUser_B_index" ON "_LanguageToUser"("B");

-- AlterTable: Update OAuth cascade behavior
ALTER TABLE "OAuth" DROP CONSTRAINT IF EXISTS "OAuth_userId_fkey";
ALTER TABLE "OAuth" ADD CONSTRAINT "OAuth_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Update Activity cascade behavior for user relation
ALTER TABLE "Activity" DROP CONSTRAINT IF EXISTS "Activity_userId_fkey";
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Many-to-many relation between Language and User
ALTER TABLE "_LanguageToUser" ADD CONSTRAINT "_LanguageToUser_A_fkey"
    FOREIGN KEY ("A") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_LanguageToUser" ADD CONSTRAINT "_LanguageToUser_B_fkey"
    FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: User's primary language relation
ALTER TABLE "User" ADD CONSTRAINT "User_primaryLanguageId_fkey"
    FOREIGN KEY ("primaryLanguageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey: Activity's language relation
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_languageId_fkey"
    FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create index for foreign keys
CREATE INDEX "User_primaryLanguageId_idx" ON "User"("primaryLanguageId");
CREATE INDEX "Activity_languageId_idx" ON "Activity"("languageId");

-- Seed Languages
INSERT INTO "Language" (code, name, "createdAt", "updatedAt") VALUES
('en', 'English', NOW(), NOW()),
('es', 'Spanish', NOW(), NOW()),
('fr', 'French', NOW(), NOW()),
('de', 'German', NOW(), NOW()),
('ja', 'Japanese', NOW(), NOW()),
('ko', 'Korean', NOW(), NOW()),
('zh', 'Chinese', NOW(), NOW()),
('ru', 'Russian', NOW(), NOW()),
('pt', 'Portuguese', NOW(), NOW()),
('it', 'Italian', NOW(), NOW());

-- Set English (id=1) as default primary language for existing users
UPDATE "User" SET "primaryLanguageId" = 1 WHERE "primaryLanguageId" IS NULL;

-- Link all existing users to English language in the many-to-many table
INSERT INTO "_LanguageToUser" ("A", "B")
SELECT 1, "id" FROM "User"
WHERE NOT EXISTS (
    SELECT 1 FROM "_LanguageToUser" WHERE "A" = 1 AND "B" = "User"."id"
);

-- Set English as the language for all existing activities
UPDATE "Activity" SET "languageId" = 1 WHERE "languageId" IS NULL;

-- Make columns non-nullable now that we've set default values
ALTER TABLE "Activity" ALTER COLUMN "languageId" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "primaryLanguageId" SET NOT NULL;
