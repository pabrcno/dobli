"use client";
import {
  Box,
  Center,
  Heading,
  Spinner,
  Text,
  VStack,
  Container,
} from "@chakra-ui/react";
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
      <Container
        maxW="container.xl"
        py={10}
        bgGradient="linear(to-b, salmon, orange.100)"
        minHeight="100vh"
        minWidth="100vw"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <VStack spacing={8} maxW="600px" width="100%">
          <YouTubeUrlInput />
          {!!video && (
            <Box w="100%" p={4} boxShadow="md" borderRadius="lg" bg="gray.100">
              <VideoPreview
                video={video}
                comment={latestComment}
                onRefresh={refreshVideo}
                isRefreshing={
                  refreshLatestCommentMutation.isLoading ||
                  refreshVideoViewCountMutation.isLoading
                }
              />
            </Box>
          )}
          {/* Conditional rendering based on data loading or existence */}
          {getLastVideoQuery.isLoading ? (
            <Center w="100%" py={10}>
              <Spinner color="blue.500" size="xl" />
            </Center>
          ) : getLastVideoQuery.data ? (
            <Box w="100%" p={4} boxShadow="md" borderRadius="lg" bg="gray.100">
              <Heading size="sm" mb={4} color="gray.600">
                Latest Video
              </Heading>
              <VideoPreview
                video={{
                  ...getLastVideoQuery.data,
                  updatedAt: new Date(getLastVideoQuery.data.updatedAt),
                }}
                comment={null}
              />
            </Box>
          ) : (
            <Text>No latest video found.</Text>
          )}
        </VStack>
      </Container>
    </main>
  );
}
