import { IVideoService } from "../services/video/i-video-service";
import { IStorageService } from "../services/storage/i-storage-service";
import { ITranslationService } from "../services/translation/i-translation-service";
import { IAudioProcessingService } from "../services/audio-processing/i-audio-processing-service";
import { EISOLanguages } from "../services/translation/e-iso-languages";
import { IVideoRepo } from "../repo/i-video-repo";
import { ICommentRepo } from "../repo/i-comment-repo";

export class VideoController {
  constructor(
    private videoRepo: IVideoRepo,
    private commentRepo: ICommentRepo,
    private videoService: IVideoService,
    private storageService: IStorageService,
    private audioProcessingService: IAudioProcessingService,
    private translationService: ITranslationService
  ) {}

  async processVideoFromUrl(url: string) {
    const audioSnippetConfig = {
      startSecond: 0,
      endSecond: 60,
    };
    try {
      const video = await this.videoService.getVideo(url);
      const audioSnippet = await this.videoService.getVideoAudioSnippet(
        video.url,
        audioSnippetConfig.startSecond,
        audioSnippetConfig.endSecond
      );
      const audioTranscript = await this.audioProcessingService.stt(
        audioSnippet
      );
      const translation = await this.translationService.translateText(
        audioTranscript,
        EISOLanguages.Spanish
      );
      const translatedAudio = await this.audioProcessingService.tts(
        translation
      );
      const translationAudioUrl = await this.storageService.uploadFile(
        translatedAudio,
        `audio-snippets/${video.youtubeId}-es.mp3`
      );
      const latestComment = await this.videoService.getLatestComment(
        video.youtubeId
      );
      const audioUrl = await this.storageService.uploadFile(
        Buffer.concat(audioSnippet),
        `audio-snippets/${video.youtubeId}.mp3`
      );
      const videoRecord = await this.videoRepo.create({
        ...video,
        audioUrl,
        translation,
        transcript: audioTranscript,
        translationAudioUrl,
      });
      const commentRecord = await this.commentRepo.create({
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
  }

  async refreshVideoViewCount(youtubeId: string, videoId: number) {
    try {
      const newViewCount = await this.videoService.getVideoViewCount(youtubeId);
      const updatedVideo = await this.videoRepo.update(videoId, {
        viewCount: newViewCount,
      });

      return updatedVideo;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async refreshLatestComment(videoId: number) {
    try {
      const video = await this.videoRepo.findOne(videoId);
      if (!video) throw new Error("Video not found");

      const latestComment = await this.videoService.getLatestComment(
        video.youtubeId
      );
      const commentRecord = await this.commentRepo.create({
        comment: latestComment,
        videoId: video.id,
      });

      return commentRecord;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getLatestVideo() {
    try {
      const video = await this.videoRepo.findLatest();
      return video;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
