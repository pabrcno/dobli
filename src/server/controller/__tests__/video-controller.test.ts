import { ICommentRepo } from "@/server/repo/i-comment-repo";
import { IVideoRepo } from "@/server/repo/i-video-repo";
import { IAudioProcessingService } from "@/server/services/audio-processing/i-audio-processing-service";
import { IStorageService } from "@/server/services/storage/i-storage-service";
import { ITranslationService } from "@/server/services/translation/i-translation-service";
import { IVideoService } from "@/server/services/video/i-video-service";
import { VideoController } from "../video-controller";
import { EISOLanguages } from "@/server/services/translation/EISOLanguages";

// Mock the dependencies
jest.mock("../services/video/i-video-service");
jest.mock("../services/storage/i-storage-service");
jest.mock("../services/translation/i-translation-service");
jest.mock("../services/audio-processing/i-audio-processing-service");
jest.mock("../repo/i-video-repo");
jest.mock("../repo/i-comment-repo");

// Types for our mocks to provide IntelliSense
type MockVideoRepo = jest.Mocked<IVideoRepo>;
type MockCommentRepo = jest.Mocked<ICommentRepo>;
type MockVideoService = jest.Mocked<IVideoService>;
type MockStorageService = jest.Mocked<IStorageService>;
type MockAudioProcessingService = jest.Mocked<IAudioProcessingService>;
type MockTranslationService = jest.Mocked<ITranslationService>;

describe("VideoController", () => {
  let videoController: VideoController;
  let videoRepo: MockVideoRepo;
  let commentRepo: MockCommentRepo;
  let videoService: MockVideoService;
  let storageService: MockStorageService;
  let audioProcessingService: MockAudioProcessingService;
  let translationService: MockTranslationService;
  const url = "http://example.com/video";
  const fakeVideo = {
    url: "http://example.com/video",
    youtubeId: "123abc",
    // ...other properties
  };
  const fakeAudioSnippet = Buffer.from("fake audio");
  const fakeTranscript = "This is a fake transcript";
  const fakeTranslation = "Esta es una transcripción falsa";
  const fakeTranslatedAudio = Buffer.from("fake translated audio");
  const fakeTranslationAudioUrl = "http://example.com/translated-audio.mp3";
  const fakeComment = "This is a fake comment";

  beforeEach(() => {
    // Initialize the mocks before each test
    videoRepo = {} as MockVideoRepo;
    commentRepo = {} as MockCommentRepo;
    videoService = {} as MockVideoService;
    storageService = {} as MockStorageService;
    audioProcessingService = {} as MockAudioProcessingService;
    translationService = {} as MockTranslationService;

    // Create an instance of the controller before each test
    videoController = new VideoController(
      videoRepo,
      commentRepo,
      videoService,
      storageService,
      audioProcessingService,
      translationService
    );
  });

  // Write tests for processVideoFromUrl here
  describe("processVideoFromUrl", () => {
    it("should process a video from URL successfully", async () => {
      const videoController = new VideoController(
        videoRepo,
        commentRepo,
        videoService,
        storageService,
        audioProcessingService,
        translationService
      );

      const result = await videoController.processVideoFromUrl(url);

      // Verify that each method was called with the correct parameters
      expect(videoService.getVideo).toHaveBeenCalledWith(url);
      expect(videoService.getVideoAudioSnippet).toHaveBeenCalledWith(
        fakeVideo.url,
        30,
        45
      );
      expect(audioProcessingService.stt).toHaveBeenCalledWith(fakeAudioSnippet);
      expect(translationService.translateText).toHaveBeenCalledWith(
        fakeTranscript,
        EISOLanguages.Spanish
      );
      expect(audioProcessingService.tts).toHaveBeenCalledWith(fakeTranslation);
      expect(storageService.uploadFile).toHaveBeenCalledWith(
        fakeTranslatedAudio,
        expect.stringContaining(fakeVideo.youtubeId)
      );
      expect(videoService.getLatestComment).toHaveBeenCalledWith(
        fakeVideo.youtubeId
      );
      expect(storageService.uploadFile).toHaveBeenCalledWith(
        fakeAudioSnippet,
        expect.stringContaining(fakeVideo.youtubeId)
      );
      expect(videoRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          audioUrl: expect.any(String),
          translation: fakeTranslation,
          transcript: fakeTranscript,
          translationAudioUrl: fakeTranslationAudioUrl,
        })
      );
      expect(commentRepo.create).toHaveBeenCalledWith({
        comment: fakeComment,
        videoId: fakeVideo.youtubeId,
      });

      // Verify that the result is correct
      expect(result).toEqual({
        video: expect.any(Object),
        latestComment: expect.any(Object),
      });
    });

    // Add more tests for error handling
    // ...
  });

  // Write tests for refreshVideoViewCount here
  // ...

  // Write tests for refreshLatestComment here
  // ...

  // Write tests for getLatestVideo here
  // ...
});
