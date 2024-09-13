/*
  Warnings:

  - Added the required column `youtubeId` to the `videos` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "videos_url_key";

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "youtubeId" TEXT NOT NULL;
