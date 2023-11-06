-- CreateTable
CREATE TABLE "Video" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "lastComment" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "transcript" TEXT,
    "audioUrl" TEXT,
    "translation" TEXT,
    "defaultAudioLanguage" TEXT,
    "targetLanguage" TEXT,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Video_url_key" ON "Video"("url");
