import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { YoutubeVideoService } from "./services/video/youtube-video-service";

import { VideoRepository } from "./repo/video-repo";
import { CommentRepository } from "./repo/comment-repo";
import { GCPStorageService } from "./services/storage/gcp-storage-service";
import { AUDIO_SNIPPET_BUCKET } from "./constants";
import { config } from "dotenv";
import { EISOLanguages } from "./services/translation/EISOLanguages";
import { GCPTranslationService } from "./services/translation/gcp-translation-service";
import { OpenAIAudioProcessingService } from "./services/audio-processing/openai-audio-processing-service";
config();

// Assuming apiKey is retrieved from environment or configuration
const apiKey: string = process.env.YOUTUBE_API_KEY || "";

const videoServiceInstance = YoutubeVideoService.getInstance(apiKey);

export const appRouter = router({
  processVideoFromUrl: publicProcedure
    .input(z.string().url())
    .mutation(async ({ input }) => {
      try {
        const videoRepo = VideoRepository.getInstance();
        const commentRepository = CommentRepository.getInstance();

        const video = await videoServiceInstance.getVideo(input);

        const storageService = new GCPStorageService(AUDIO_SNIPPET_BUCKET);
        const translationService = new GCPTranslationService();

        const audioProcessingService = new OpenAIAudioProcessingService();

        const audioSnippet = await videoServiceInstance.getVideoAudioSnippet(
          video.url,
          30,
          45
        );

        const audioTranscript = await audioProcessingService.stt(audioSnippet);

        const translation = await translationService.translateText(
          audioTranscript,
          EISOLanguages.Spanish
        );

        const translatedAudio = await audioProcessingService.tts(translation);

        const translationAudioUrl = await storageService.uploadFile(
          translatedAudio,
          "audio-snippets/" + video.youtubeId + "-es.mp3"
        );

        const latestComment = await videoServiceInstance.getLatestComment(
          video.youtubeId
        );

        const audioUrl = await storageService.uploadFile(
          audioSnippet,
          "audio-snippets/" + video.youtubeId + ".mp3"
        );

        const videoRecord = await videoRepo.create({
          ...video,
          audioUrl,
          translation,
          transcript: audioTranscript,
          translationAudioUrl,
        });

        const commentRecord = await commentRepository.create({
          comment: latestComment,
          videoId: videoRecord.id,
        });

        videoRecord;

        return {
          video: videoRecord,
          latestComment: commentRecord,
        };
      } catch (e) {
        console.error(e);
        throw e;
      }
    }),

  refreshVideoViewCount: publicProcedure
    .input(z.object({ youtubeId: z.string(), videoId: z.number() }))
    .mutation(async ({ input }) => {
      const videoRepo = VideoRepository.getInstance();

      const newViewCount = await videoServiceInstance.getVideoViewCount(
        input.youtubeId
      );

      const updatedVideo = await videoRepo.update(input.videoId, {
        viewCount: newViewCount,
      });

      return updatedVideo;
    }),
  refreshLatestComment: publicProcedure
    .input(z.object({ videoId: z.number() }))
    .mutation(async ({ input }) => {
      const videoRepo = VideoRepository.getInstance();
      const commentRepository = CommentRepository.getInstance();

      const video = await videoRepo.findOne(input.videoId);
      if (!video) throw new Error("Video not found");

      const latestComment = await videoServiceInstance.getLatestComment(
        video.youtubeId
      );

      const commentRecord = await commentRepository.create({
        comment: latestComment,
        videoId: video.id,
      });

      return commentRecord;
    }),

  getLatestVideo: publicProcedure.query(async () => {
    const videoRepo = VideoRepository.getInstance();
    const video = await videoRepo.findLatest();
    return video;
  }),
});

export type AppRouter = typeof appRouter;
