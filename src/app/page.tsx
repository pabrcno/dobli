"use client";
import { Box, Center, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { YouTubeUrlInput } from "./components/youtube-url-input";
import { useAtom } from "jotai";
import { currentVideoLatestCommentAtom, videoAtom } from "./store";
import { VideoPreview } from "./components/video-preview";

import { trpc } from "./_trpc/client";

export default function Home() {
  const [video, setVideo] = useAtom(videoAtom);
  const [latestComment, setLatestComment] = useAtom(
    currentVideoLatestCommentAtom
  );

  const refreshVideoViewCountMutation =
    trpc.refreshVideoViewCount.useMutation();

  const refreshLatestCommentMutation = trpc.refreshLatestComment.useMutation();

  const getLastVideoQuery = trpc.getLatestVideo.useQuery();

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
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
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

        <Box maxWidth={600}>
          {!!getLastVideoQuery.isLoading && <Spinner />}
          {!!getLastVideoQuery.data && (
            <Box mt={8}>
              <Heading>Latest Video:</Heading>
              <Box mt={4} />
              <VideoPreview
                video={{
                  ...getLastVideoQuery.data,
                  updatedAt: new Date(getLastVideoQuery.data.updatedAt),
                }}
                comment={null}
              />
            </Box>
          )}
        </Box>
      </Flex>
    </main>
  );
}
