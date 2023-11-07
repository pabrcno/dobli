import { ICommentRepo } from "@/server/repo/i-comment-repo";
import { IVideoRepo } from "@/server/repo/i-video-repo";
import { IAudioProcessingService } from "@/server/services/audio-processing/i-audio-processing-service";
import { IStorageService } from "@/server/services/storage/i-storage-service";
import { ITranslationService } from "@/server/services/translation/i-translation-service";
import { IVideoService } from "@/server/services/video/i-video-service";
import { VideoController } from "../video-controller";
import { EISOLanguages } from "../../services/translation/e-iso-languages";
import { Video } from "@prisma/client";

// Mock the dependencies
jest.mock("../../services/video/i-video-service");
jest.mock("../../services/storage/i-storage-service");
jest.mock("../../services/translation/i-translation-service");
jest.mock("../../services/audio-processing/i-audio-processing-service");
jest.mock("../../repo/i-video-repo");
jest.mock("../../repo/i-comment-repo");

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
  const url = "https://www.youtube.com/watch?v=jFk6dJ0RHm0";
  const fakeVideo = {
    // ...other properties
  };
  const fakeAudioSnippet = Buffer.from("fake audio");
  const fakeTranscript = "This is a fake transcript";
  const fakeTranslation = "Esta es una transcripción falsa";
  const fakeTranslatedAudio = Buffer.from("fake translated audio");
  const fakeTranslationAudioUrl = "http://example.com/translated-audio.mp3";
  const mockComment = {
    id: 1,
    channelId: "channel-id",
    videoId: 1,
    textDisplay: "This is a fake comment",
    textOriginal: "This is a fake comment",
    authorDisplayName: "Author",
    authorProfileImageUrl: "http://example.com/profile.jpg",
  };

  const mockVideo: Video = {
    id: 1,
    url: "https://www.youtube.com/watch?v=jFk6dJ0RHm0",
    youtubeId: "jFk6dJ0RHm0",
    title: "Fake Video Title",
    viewCount: 123,
    lastCommentId: null,
    updatedAt: new Date(),
    transcript: fakeTranscript,
    audioUrl: "http://example.com/audio.mp3",
    translation: fakeTranslation,
    defaultAudioLanguage: "en",
    targetLanguage: "es",
    thumbnailUrl: "http://example.com/thumbnail.jpg",
    translationAudioUrl: fakeTranslationAudioUrl,
  };

  beforeEach(() => {
    // Mock implementations for the video repository

    videoRepo = {
      create: jest.fn().mockResolvedValue(mockVideo),
      findOne: jest.fn().mockResolvedValue(mockVideo),
      findAll: jest.fn().mockResolvedValue([mockVideo]), // Repeat mockVideo to simulate an array of videos if needed
      update: jest.fn().mockResolvedValue({ ...mockVideo, viewCount: 456 }), // Assume view count has been updated
      delete: jest.fn().mockResolvedValue(mockVideo),
      findLatest: jest.fn().mockResolvedValue(mockVideo), // Assume this returns the latest video
    } as MockVideoRepo;

    commentRepo = {
      create: jest.fn().mockResolvedValue(mockComment),
      findOne: jest.fn().mockResolvedValue({
        // ...provide mock return value based on Comment model
      }),
      findAll: jest.fn().mockResolvedValue([
        // ...provide mock return array based on Comment model
      ]),
      update: jest.fn().mockResolvedValue({
        // ...provide mock return value based on Comment model
      }),
      delete: jest.fn().mockResolvedValue({
        // ...provide mock return value based on Comment model
      }),
      // ...potentially other methods specific to ICommentRepo
    } as MockCommentRepo;

    // Mock implementations for the video service
    videoService = {
      getVideo: jest.fn().mockResolvedValue({
        url: mockVideo.url,
        youtubeId: mockVideo.youtubeId,
      }),
      getVideoAudioSnippet: jest.fn().mockResolvedValue(fakeAudioSnippet),
      getLatestComment: jest.fn().mockResolvedValue({
        channelId: "channel-id",
        textDisplay: mockComment,
        textOriginal: mockComment,
        authorDisplayName: "Author",
        authorProfileImageUrl: "http://example.com/profile.jpg",
        // ...other properties of Comment excluding 'id' and 'videoId'
      }),
      getVideoViewCount: jest.fn().mockResolvedValue(123), // Mock return for view count
      // ...other methods with mock implementations
    } as MockVideoService;

    // Mock implementations for the storage service
    storageService = {
      uploadFile: jest.fn().mockResolvedValue(fakeTranslationAudioUrl),
      downloadFile: jest.fn(), // Assume this resolves without a value
      // ...other methods with mock implementations
    } as MockStorageService;

    // Mock implementations for the audio processing service
    audioProcessingService = {
      stt: jest.fn().mockResolvedValue(fakeTranscript),
      tts: jest.fn().mockResolvedValue(fakeTranslatedAudio),
      // ...other methods with mock implementations
    } as MockAudioProcessingService;

    // Mock implementations for the translation service
    translationService = {
      translateText: jest.fn().mockResolvedValue(fakeTranslation),
      // ...other methods with mock implementations
    } as MockTranslationService;

    // Initialize the videoController with the mocked services
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
        mockVideo.url,
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
        expect.stringContaining(mockVideo.youtubeId)
      );
      expect(videoService.getLatestComment).toHaveBeenCalledWith(
        mockVideo.youtubeId
      );
      expect(storageService.uploadFile).toHaveBeenCalledWith(
        fakeAudioSnippet,
        expect.stringContaining(mockVideo.youtubeId)
      );
      expect(videoRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          audioUrl: expect.any(String),
          translation: fakeTranslation,
          transcript: fakeTranscript,
          translationAudioUrl: fakeTranslationAudioUrl,
        })
      );
      expect(commentRepo.create).toHaveBeenCalled();

      // Verify that the result is correct
      expect(result).toEqual({
        video: expect.any(Object),
        latestComment: expect.any(Object),
      });
    });

    // Add more tests for error handling
    // ...
  });

  describe("refreshVideoViewCount", () => {
    it("should refresh the video view count successfully", async () => {
      const newViewCount = 456;
      videoService.getVideoViewCount.mockResolvedValue(newViewCount);

      const result = await videoController.refreshVideoViewCount(
        mockVideo.youtubeId,
        mockVideo.id
      );

      expect(videoService.getVideoViewCount).toHaveBeenCalledWith(
        mockVideo.youtubeId
      );
      expect(videoRepo.update).toHaveBeenCalledWith(mockVideo.id, {
        viewCount: newViewCount,
      });
      expect(result).toEqual({ ...mockVideo, viewCount: newViewCount });
    });

    // Add more tests to handle different scenarios, such as when the video is not found
    // ...
  });

  describe("refreshLatestComment", () => {
    it("should refresh the latest comment successfully", async () => {
      const refreshedComment = {
        ...mockComment,
        textDisplay: "This is an updated comment",
      };
      videoService.getLatestComment.mockResolvedValue(refreshedComment);
      commentRepo.create.mockResolvedValue(refreshedComment);

      const result = await videoController.refreshLatestComment(mockVideo.id);

      expect(videoRepo.findOne).toHaveBeenCalledWith(mockVideo.id);
      expect(videoService.getLatestComment).toHaveBeenCalledWith(
        mockVideo.youtubeId
      );
      expect(commentRepo.create).toHaveBeenCalledWith({
        comment: refreshedComment,
        videoId: mockVideo.id,
      });
      expect(result).toEqual(refreshedComment);
    });

    // Add more tests to handle error scenarios, such as when the latest comment cannot be fetched
    // ...
  });

  // Write tests for getLatestVideo here
  describe("getLatestVideo", () => {
    it("should get the latest video successfully", async () => {
      const result = await videoController.getLatestVideo();

      expect(videoRepo.findLatest).toHaveBeenCalled();
      expect(result).toEqual(mockVideo);
    });
  });
});
