/*
  Warnings:

  - You are about to drop the column `lastComment` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "lastComment",
ADD COLUMN     "lastCommentId" INTEGER,
ADD COLUMN     "thumbnailUrl" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "viewCount" DROP NOT NULL;
