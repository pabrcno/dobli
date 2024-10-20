import { Comment, Video } from "@prisma/client";

export interface IVideoService {
  getVideo(url: string): Promise<Omit<Video, "id">>;
  getVideoViewCount(videoId: string): Promise<number>;
  getLatestComment(videoId: string): Promise<Omit<Comment, "id" | "videoId">>;
  getVideoAudioSnippet(
    videoUrl: string,
    startTime: number,
    endTime: number
  ): Promise<Uint8Array[]>;
}
