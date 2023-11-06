import React from "react";
import { Box, Text, Flex, Avatar } from "@chakra-ui/react";
import { Comment } from "@prisma/client";

export function CommentPreview({ comment }: { comment: Comment }) {
  return (
    <Box mt={4}>
      <Flex align="center">
        <Avatar
          size="sm"
          name={comment.authorDisplayName}
          src={comment.authorProfileImageUrl}
        />
        <Box p={5}>
          <Text fontSize="md" fontWeight="semibold">
            Latest Comment:
          </Text>
          <Text fontSize="sm">{comment.authorDisplayName}</Text>
        </Box>
      </Flex>
      <Flex mt={2} align="center">
        <Text ml={2} fontSize="sm">
          {comment.textDisplay}
        </Text>
      </Flex>
    </Box>
  );
}
