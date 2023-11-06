"use client";
import { Box, Flex } from "@chakra-ui/react";
import { YouTubeUrlInput } from "./components/youtube-url-input";
import { useAtom } from "jotai";
import { currentVideoLatestCommentAtom, videoAtom } from "./store";
import { VideoPreview } from "./components/video-preview";
import { CommentPreview } from "./components/comment-preview";
import { trpc } from "./_trpc/client";

export default function Home() {
  const [video, setVideo] = useAtom(videoAtom);
  const [latestComment, setLatestComment] = useAtom(
    currentVideoLatestCommentAtom
  );

  const refreshVideoViewCountMutation =
    trpc.refreshVideoViewCount.useMutation();

  const refreshLatestCommentMutation = trpc.refreshLatestComment.useMutation();

  const refreshVideo = async () => {
    if (!video) return;

    const updatedVideo = await refreshVideoViewCountMutation.mutateAsync({
      videoId: video.id,
      youtubeId: video.youtubeId,
    });

    const updatedComment = await refreshLatestCommentMutation.mutateAsync({
      videoId: video.id,
    });

    setVideo({ ...updatedVideo, updatedAt: new Date(updatedVideo.updatedAt) });

    setLatestComment(updatedComment);
  };

  return (
    <main>
      <Box width="100vw" height="100vh">
        <Flex alignItems="center" justifyContent="center" height="100%">
          <Flex flexDirection="column" align="center">
            <YouTubeUrlInput />
            <Box mt={4} />
            <Box maxWidth={600}>
              {!!video && (
                <VideoPreview
                  video={video}
                  comment={latestComment}
                  onRefresh={refreshVideo}
                  isRefreshing={
                    refreshLatestCommentMutation.isLoading ||
                    refreshVideoViewCountMutation.isLoading
                  }
                />
              )}
            </Box>
          </Flex>
        </Flex>
      </Box>
    </main>
  );
}
