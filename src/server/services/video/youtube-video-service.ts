import { TRPCError } from "@trpc/server";
import { IVideoService } from "./i-video-service";
import {
  EVideoDetailType,
  YTVideo,
  VideoListResponse,
  VideoStatistics,
  YTCommentThreadListResponse,
} from "./youtube-video-types";
import { Comment, Video } from "@prisma/client";

export class YoutubeVideoService implements IVideoService {
  private static instance: YoutubeVideoService;
  private readonly apiKey: string;

  // The constructor should be private to prevent direct construction calls with the `new` operator.
  private constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public static getInstance(apiKey: string): YoutubeVideoService {
    if (!YoutubeVideoService.instance) {
      YoutubeVideoService.instance = new YoutubeVideoService(apiKey);
    }
    return YoutubeVideoService.instance;
  }

  async getVideo(url: string): Promise<Omit<Video, "id">> {
    const videoId = this.extractVideoID(url);

    const apiUrl = this.generateUrl("videos", videoId, [
      EVideoDetailType.Statistics,
      EVideoDetailType.Snippet,
    ]);

    const videoResponse: VideoListResponse = await fetch(apiUrl).then(
      (response) => response.json()
    );

    if (!videoResponse.items || videoResponse.items.length === 0)
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });

    const video: YTVideo = videoResponse.items[0];

    return {
      url,
      title: video.snippet?.title ?? null,
      viewCount: parseInt(video.statistics?.viewCount ?? "0", 10),
      lastCommentId: null,
      updatedAt: new Date(),
      transcript: null,
      audioUrl: null,
      translation: null,
      defaultAudioLanguage: video.snippet?.defaultAudioLanguage ?? null,
      targetLanguage: null,
      thumbnailUrl: video.snippet?.thumbnails?.default?.url ?? null,
      youtubeId: video.id,
    };
  }

  async getVideoViewCount(videoId: string): Promise<number> {
    const url = this.generateUrl("videos", videoId, [
      EVideoDetailType.Statistics,
    ]);

    const response = await fetch(url);
    const data: { items: { statistics: VideoStatistics }[] } =
      await response.json();

    if (!data.items || data.items.length === 0)
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });

    return parseInt(data.items[0].statistics.viewCount, 10);
  }

  async getLatestComment(
    videoId: string
  ): Promise<Omit<Comment, "id" | "videoId">> {
    const url = this.generateUrl(
      "commentThreads",
      videoId,
      [EVideoDetailType.Snippet],
      "videoId"
    );
    const response = await fetch(url);
    const data: YTCommentThreadListResponse = await response.json();

    if (!data.items)
      throw new TRPCError({ code: "NOT_FOUND", message: "Comments not found" });

    const snippet = data.items[0].snippet.topLevelComment.snippet;

    // Map the data from the YouTube API response to the PrismaCommentWithoutId type
    const comment: Omit<Comment, "id" | "videoId"> = {
      channelId: snippet.channelId,
      textDisplay: snippet.textDisplay,
      textOriginal: snippet.textOriginal,
      authorDisplayName: snippet.authorDisplayName,
      authorProfileImageUrl: snippet.authorProfileImageUrl,
    };

    return comment;
  }

  getVideoAudioSnippet(
    videoId: string,
    startTime: number,
    endTime: number
  ): Promise<Blob> {
    throw new Error("Method not implemented.");
  }

  private extractVideoID(url: string): string {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  }

  private generateUrl(
    endpoint: string,
    videoId: string,
    parts: EVideoDetailType[],
    idPrefix = "id"
  ): string {
    const apiBaseUrl: string = "https://www.googleapis.com/youtube/v3";
    const partsQuery = parts
      .map((part) => `part=${encodeURIComponent(part)}`)
      .join("&");
    return `${apiBaseUrl}/${endpoint}?${partsQuery}&${idPrefix}=${encodeURIComponent(
      videoId
    )}&key=${this.apiKey}`;
  }
}
