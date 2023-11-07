import React from "react";
import { Box, Text, Flex, Avatar, Spinner } from "@chakra-ui/react";
import { Comment } from "@prisma/client";

export function CommentPreview({
  comment,
  isLoading,
}: {
  comment: Comment;
  isLoading?: boolean;
}) {
  return (
    <Box>
      <Text fontSize="sm">Latest Comment:</Text>
      <Flex align="center">
        {!isLoading ? (
          <Avatar
            size="sm"
            name={comment.authorDisplayName}
            src={comment.authorProfileImageUrl}
          />
        ) : (
          <Spinner />
        )}
        <Box p={5}>
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
