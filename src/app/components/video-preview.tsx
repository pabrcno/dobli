"use client";
import React from "react";
import {
  Image,
  Text,
  Stack,
  Heading,
  Flex,
  Card,
  Button,
  Spinner,
  Divider,
  Box,
} from "@chakra-ui/react";
import { Video, Comment } from "@prisma/client";

import { CommentPreview } from "./comment-preview";

export function VideoPreview({
  video,
  comment,
  onRefresh,
  isRefreshing,
}: {
  video: Video;
  comment: Comment | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  return (
    <Card p={2}>
      <Flex alignItems="center" mb={5}>
        <Stack flex={1} ml={4}>
          <Heading fontSize="md">{video.title || "Untitled"}</Heading>

          <Flex
            mt={2}
            align="center"
            justify="space-between"
            minWidth="100%"
            minHeight="100px"
          >
            {isRefreshing ? (
              <Spinner />
            ) : (
              <Text color="gray.500">
                {video.viewCount != null
                  ? `${video.viewCount.toLocaleString()} views`
                  : "View count not available"}
              </Text>
            )}
            {!!onRefresh && (
              <Button mx={4} onClick={onRefresh}>
                Refresh
              </Button>
            )}
            {!!video?.audioUrl && (
              <Box px={4}>
                <audio controls src={video?.audioUrl} />
              </Box>
            )}
          </Flex>
        </Stack>
      </Flex>

      {!!video.translation && (
        <Box mt={2}>
          <Flex align="center">
            <Text fontSize="md" fontWeight="semibold">
              Translation:
            </Text>
            {!!video.translationAudioUrl && (
              <Box px={4}>
                <audio controls src={video?.translationAudioUrl} />
              </Box>
            )}
          </Flex>
          <Text fontSize="sm" p={2}>
            {video.translation}
          </Text>
        </Box>
      )}
      {!!comment && (
        <>
          <Divider />

          <CommentPreview comment={comment} isLoading={isRefreshing} />
        </>
      )}
    </Card>
  );
}
