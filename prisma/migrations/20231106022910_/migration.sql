/*
  Warnings:

  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Video";

-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "viewCount" INTEGER,
    "lastCommentId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transcript" TEXT,
    "audioUrl" TEXT,
    "translation" TEXT,
    "defaultAudioLanguage" TEXT,
    "targetLanguage" TEXT,
    "thumbnailUrl" TEXT,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "channelId" TEXT NOT NULL,
    "videoId" INTEGER NOT NULL,
    "textDisplay" TEXT NOT NULL,
    "textOriginal" TEXT NOT NULL,
    "authorDisplayName" TEXT NOT NULL,
    "authorProfileImageUrl" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "videos_url_key" ON "videos"("url");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
