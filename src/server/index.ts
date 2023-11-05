import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { YoutubeVideoService } from "./services/video/youtube-video-service";
import "dotenv/config";

// Assuming apiKey is retrieved from environment or configuration
const apiKey: string = process.env.YOUTUBE_API_KEY || "";
console.log("apiKey", apiKey);
const videoServiceInstance = YoutubeVideoService.getInstance(apiKey);

export const appRouter = router({
  hello: publicProcedure.query(() => {
    return "Hello World!";
  }),
  createVideoTitle: publicProcedure
    .input(z.string().url())
    .mutation(async ({ input }) => {
      return videoServiceInstance.getVideo(input);
    }),
  getVideoViewCount: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return videoServiceInstance.getVideoViewCount(input);
    }),
  getLatestComment: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      return videoServiceInstance.getLatestComment(input);
    }),
  // getVideoAudioSnippet: publicProcedure.query(...) // You'd implement this similar to the others, once the method is fully implemented in your service.
});

export type AppRouter = typeof appRouter;
