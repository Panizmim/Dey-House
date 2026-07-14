-- AlterTable
ALTER TABLE "Studio" ADD COLUMN "slug" TEXT;

-- Backfill existing rows with a slug derived from their current name
UPDATE "Studio" SET "slug" = replace(regexp_replace(name, '\s+', '-', 'g'), ' ', '') WHERE "slug" IS NULL;

-- Ensure column is required and unique going forward
ALTER TABLE "Studio" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Studio_slug_key" ON "Studio"("slug");
