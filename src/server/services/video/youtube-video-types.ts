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
export type YTVideo = {
  kind: string;
  etag: string;
  id: string;
  snippet?: VideoSnippet;
  statistics?: VideoStatistics;
  contentDetails?: VideoContentDetails;
};

// Define the type for the video list response
export type VideoListResponse = {
  kind: string;
  etag: string;
  items: YTVideo[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
};

export type YTAuthorChannelId = {
  value: string;
};

export type YTCommentSnippet = {
  channelId: string;
  videoId: string;
  textDisplay: string;
  textOriginal: string;
  authorDisplayName: string;
  authorProfileImageUrl: string;
  authorChannelUrl: string;
  authorChannelId: YTAuthorChannelId;
  canRate: boolean;
  viewerRating: string;
  likeCount: number;
  publishedAt: string;
  updatedAt: string;
};

export type YTTopLevelComment = {
  kind: string;
  etag: string;
  id: string;
  snippet: YTCommentSnippet;
};

export type YTCommentThreadSnippet = {
  channelId: string;
  videoId: string;
  topLevelComment: YTTopLevelComment;
  canReply: boolean;
  totalReplyCount: number;
  isPublic: boolean;
};

export type YTCommentThread = {
  kind: string;
  etag: string;
  id: string;
  snippet: YTCommentThreadSnippet;
};

export type YTPageInfo = {
  totalResults: number;
  resultsPerPage: number;
};

export type YTCommentThreadListResponse = {
  kind: string;
  etag: string;
  nextPageToken: string;
  pageInfo: YTPageInfo;
  items: YTCommentThread[];
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

export type VideoContentDetails = {
  duration: string;
  dimension: string;
  definition: string;
  caption: string;
  licensedContent: boolean;
  contentRating: {};
  projection: string;
};
