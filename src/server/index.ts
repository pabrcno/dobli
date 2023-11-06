import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { YoutubeVideoService } from "./services/video/youtube-video-service";
import "dotenv/config";
import { VideoRepository } from "./repo/video-repo";
import { CommentRepository } from "./repo/comment-repo";

// Assuming apiKey is retrieved from environment or configuration
const apiKey: string = process.env.YOUTUBE_API_KEY || "";

const videoServiceInstance = YoutubeVideoService.getInstance(apiKey);

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello World!";
  }),
  processVideoFromUrl: publicProcedure
    .input(z.string().url())
    .mutation(async ({ input }) => {
      try {
        const videoRepo = VideoRepository.getInstance();
        const commentRepository = CommentRepository.getInstance();

        const video = await videoServiceInstance.getVideo(input);
        const latestComment = await videoServiceInstance.getLatestComment(
          video.youtubeId
        );

        const videoRecord = await videoRepo.create(video);

        const commentRecord = await commentRepository.create({
          comment: latestComment,
          videoId: videoRecord.id,
        });

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
      console.log(latestComment);

      const commentRecord = await commentRepository.create({
        comment: latestComment,
        videoId: video.id,
      });

      return commentRecord;
    }),
  // getVideoAudioSnippet: publicProcedure.query(...) // You'd implement this similar to the others, once the method is fully implemented in your service.
});

export type AppRouter = typeof appRouter;
