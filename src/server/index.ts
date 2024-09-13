import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { YoutubeVideoService } from "./services/video/youtube-video-service";

import { VideoRepository } from "./repo/video-repo";
import { CommentRepository } from "./repo/comment-repo";
import { GCPStorageService } from "./services/storage/gcp-storage-service";
import { config } from "dotenv";
import { GCPTranslationService } from "./services/translation/gcp-translation-service";
import { OpenAIAudioProcessingService } from "./services/audio-processing/openai-audio-processing-service";
import { VideoController } from "./controller/video-controller";
import { PrismaClient } from "@prisma/client";

export const appRouter = (() => {
  config();

  // Assuming apiKey is retrieved from environment or configuration
  const apiKey = process.env.YOUTUBE_API_KEY;

  const audioSnippetBucket = process.env.AUDIO_SNIPPET_BUCKET;

  const projectId = process.env.GOOGLE_PROJECT_ID;

  const credentials = process.env.GCP_SA;

  const prisma = new PrismaClient();

  if (!apiKey) throw new Error("Youtube API key not found");

  if (!audioSnippetBucket) throw new Error("Audio snippet bucket not found");

  if (!projectId) throw new Error("Google project ID not found");

  if (!credentials) throw new Error("Google service account not found");

  const videoController = new VideoController(
    VideoRepository.getInstance(prisma),
    CommentRepository.getInstance(prisma),
    YoutubeVideoService.getInstance(apiKey),
    GCPStorageService.getInstance(audioSnippetBucket, projectId, credentials),
    OpenAIAudioProcessingService.getInstance(),
    GCPTranslationService.getInstance(credentials)
  );

  return router({
    processVideoFromUrl: publicProcedure
      .input(z.string().url())
      .mutation(async ({ input }) => {
        try {
          const video = await videoController.processVideoFromUrl(input);
          return video;
        } catch (e) {
          console.error(e);
          throw e;
        }
      }),

    refreshVideoViewCount: publicProcedure
      .input(z.object({ youtubeId: z.string(), videoId: z.number() }))
      .mutation(async ({ input }) => {
        const updatedVideo = await videoController.refreshVideoViewCount(
          input.youtubeId,
          input.videoId
        );

        return updatedVideo;
      }),
    refreshLatestComment: publicProcedure
      .input(z.object({ videoId: z.number() }))
      .mutation(async ({ input }) => {
        const updatedComment = await videoController.refreshLatestComment(
          input.videoId
        );

        return updatedComment;
      }),

    getLatestVideo: publicProcedure.query(async () => {
      const video = await videoController.getLatestVideo();
      return video;
    }),
  });
})();

export type AppRouter = typeof appRouter;
