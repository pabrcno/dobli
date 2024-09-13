import React from "react";
import {
  Text,
  Heading,
  Button,
  Spinner,
  Divider,
  Box,
  VStack,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { Video, Comment } from "@prisma/client";
import { motion } from "framer-motion";
import { CommentPreview } from "./comment-preview";
import { AudioPlayer } from "./audio-player";
import { FaEye } from "react-icons/fa";

const MotionBox = motion(Box); // Wrap Box with motion to enable animations
const MotionButton = motion(Button); // Wrap Button with motion for animations

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
  // This object is for framer-motion to define animation
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    pressed: { scale: 0.95 },
  };

  // Define a simple fade-in animation
  const fadeIn = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <MotionBox
      initial="hidden"
      animate="show"
      variants={fadeIn}
      p={5}
      borderRadius="lg"
      minWidth="100%"
    >
      <VStack spacing={5} align="stretch">
        <HStack justifyContent="space-between">
          <HStack spacing={3}>
            <Heading fontSize="md">{video.title || "Untitled Video"}</Heading>
          </HStack>
          {!!video?.audioUrl && <AudioPlayer src={video?.audioUrl} />}
        </HStack>
        <HStack spacing={1} alignItems="center" justify="space-around">
          <HStack spacing={1}>
            <Icon as={FaEye} />
            {isRefreshing ? (
              <Spinner />
            ) : (
              <Text color="gray.500">
                {video.viewCount != null
                  ? `${video.viewCount.toLocaleString()} views`
                  : "Views not available"}
              </Text>
            )}
          </HStack>
          {!!onRefresh && (
            <MotionButton
              onClick={onRefresh}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="pressed"
            >
              Refresh
            </MotionButton>
          )}
        </HStack>
        {!!video.translation && (
          <MotionBox variants={fadeIn}>
            <HStack>
              <Text fontSize="md" fontWeight="semibold">
                Translation:
              </Text>
              {!!video.translationAudioUrl && (
                <AudioPlayer src={video?.translationAudioUrl} />
              )}
            </HStack>

            <Text fontSize="xs">{video.translation}</Text>
          </MotionBox>
        )}

        {!!comment && (
          <>
            <Divider />
            <CommentPreview comment={comment} isLoading={isRefreshing} />
          </>
        )}
      </VStack>
    </MotionBox>
  );
}
