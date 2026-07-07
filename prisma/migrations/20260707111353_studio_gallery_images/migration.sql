-- AlterTable
ALTER TABLE "Studio" DROP COLUMN "imageUrl",
ADD COLUMN     "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
