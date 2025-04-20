-- DropIndex
DROP INDEX "Media_externalId_key";

-- AlterTable
ALTER TABLE "Language" ADD COLUMN "nativeName" TEXT;

-- Update existing languages with native names and correct codes
UPDATE "Language" SET "nativeName" = 'English', "code" = 'en' WHERE "name" = 'English';
UPDATE "Language" SET "nativeName" = 'Español', "code" = 'es' WHERE "name" = 'Spanish';
UPDATE "Language" SET "nativeName" = 'Français', "code" = 'fr' WHERE "name" = 'French';
UPDATE "Language" SET "nativeName" = 'Deutsch', "code" = 'de' WHERE "name" = 'German';
UPDATE "Language" SET "nativeName" = '日本語', "code" = 'ja' WHERE "name" = 'Japanese';
UPDATE "Language" SET "nativeName" = '한국어', "code" = 'ko' WHERE "name" = 'Korean';
UPDATE "Language" SET "nativeName" = '中文', "code" = 'zh' WHERE "name" = 'Chinese'; -- Note: 'zh' covers multiple variants, using the general code.
UPDATE "Language" SET "nativeName" = 'Русский', "code" = 'ru' WHERE "name" = 'Russian';
UPDATE "Language" SET "nativeName" = 'Português', "code" = 'pt' WHERE "name" = 'Portuguese';
UPDATE "Language" SET "nativeName" = 'Italiano', "code" = 'it' WHERE "name" = 'Italian';

-- Make nativeName non-nullable after updating existing rows
-- It's safer to do this in a separate step or ensure all rows are updated.
-- Assuming all languages were updated above, we can now make it non-nullable.
-- If there's a chance some weren't updated, add a default value or handle NULLs.
ALTER TABLE "Language" ALTER COLUMN "nativeName" SET NOT NULL;

