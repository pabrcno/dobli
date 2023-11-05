// Define the TypeScript type for the video snippet
export type VideoSnippet = {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: {
    [key in "default" | "medium" | "high" | "standard" | "maxres"]?: {
      url: string;
      width: number;
      height: number;
    };
  };
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: {
    title: string;
    description: string;
  };
  defaultAudioLanguage?: string;
};

// Define the TypeScript type for the video statistics
export type VideoStatistics = {
  viewCount: string;
  likeCount: string;
  favoriteCount: string;
  commentCount: string;
};

// Define the TypeScript type for the video object which now uses VideoSnippet and VideoStatistics
export type Video = {
  kind: string;
  etag: string;
  id: string;
  snippet?: VideoSnippet;
  statistics?: VideoStatistics;
};

// Define the type for the video list response
export type VideoListResponse = {
  kind: string;
  etag: string;
  items: Video[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export enum EVideoDetailType {
  ContentDetails = "contentDetails",
  FileDetails = "fileDetails",
  ID = "id",
  LiveStreamingDetails = "liveStreamingDetails",
  Localizations = "localizations",
  Player = "player",
  ProcessingDetails = "processingDetails",
  RecordingDetails = "recordingDetails",
  Snippet = "snippet",
  Statistics = "statistics",
  Status = "status",
  Suggestions = "suggestions",
  TopicDetails = "topicDetails",
}
