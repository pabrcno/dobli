import { TRPCError } from "@trpc/server";
import { IVideoService } from "./i-video-service";
import {
  EVideoDetailType,
  Video,
  VideoListResponse,
  VideoStatistics,
} from "./youtube-video-types";

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

  async getVideo(url: string): Promise<string> {
    const videoId = this.extractVideoID(url);
    console.log("videoId", videoId);
    const apiUrl = this.generateUrl("videos", videoId, [
      EVideoDetailType.Statistics,
      EVideoDetailType.Snippet,
    ]);
    console.log("apiUrl", apiUrl);
    const videoResponse: VideoListResponse = await fetch(apiUrl).then(
      (response) => response.json()
    );

    if (!videoResponse.items || videoResponse.items.length === 0)
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });

    const video: Video = videoResponse.items[0];

    if (!video.snippet?.title)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Video title not found",
      });

    return video.snippet?.title;
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

  async getLatestComment(videoId: string): Promise<string> {
    const url = this.generateUrl("commentThreads", videoId, [
      EVideoDetailType.Snippet,
    ]);
    const response = await fetch(url);
    const data: {
      items: {
        snippet: { topLevelComment: { snippet: { textDisplay: string } } };
      }[];
    } = await response.json();

    if (!data.items || data.items.length === 0)
      throw new TRPCError({ code: "NOT_FOUND", message: "Comments not found" });

    return data.items[0].snippet.topLevelComment.snippet.textDisplay;
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
    parts: EVideoDetailType[]
  ): string {
    const apiBaseUrl: string = "https://www.googleapis.com/youtube/v3";
    const partsQuery = parts
      .map((part) => `part=${encodeURIComponent(part)}`)
      .join("&");
    return `${apiBaseUrl}/${endpoint}?${partsQuery}&id=${encodeURIComponent(
      videoId
    )}&key=${this.apiKey}`;
  }
}
