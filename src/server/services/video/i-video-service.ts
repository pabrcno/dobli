export interface IVideoService {
  getVideo(url: string): Promise<string>;
  getVideoViewCount(videoId: string): Promise<number>;
  getLatestComment(videoId: string): Promise<string>;
  getVideoAudioSnippet(
    videoId: string,
    startTime: number,
    endTime: number
  ): Promise<Blob>;
}
