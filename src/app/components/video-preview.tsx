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
        {!!video.thumbnailUrl && (
          <Image
            borderRadius="md"
            src={video.thumbnailUrl}
            alt={`Thumbnail of ${video.title}`}
            fallbackSrc="https://via.placeholder.com/120x90.png?text=No+Image"
          />
        )}
        <Stack flex={1} ml={4}>
          <Heading fontSize="md">{video.title || "Untitled"}</Heading>
          {isRefreshing ? (
            <Spinner />
          ) : (
            <Flex mt={2} align="center">
              <Text color="gray.500">
                {video.viewCount != null
                  ? `${video.viewCount.toLocaleString()} views`
                  : "View count not available"}
              </Text>
              <Button ml={4} onClick={onRefresh}>
                Refresh
              </Button>
            </Flex>
          )}
        </Stack>
      </Flex>
      {!!comment && (
        <>
          <Divider />

          <CommentPreview comment={comment} />
        </>
      )}
    </Card>
  );
}
