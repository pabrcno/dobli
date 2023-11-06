"use client";
import { Box, Flex } from "@chakra-ui/react";
import { YouTubeUrlInput } from "./components/youtube-url-input";

export default function Home() {
  return (
    <main>
      <Box width="100%" height="100%">
        <Flex alignItems="center" justifyContent="center" height="100%">
          <YouTubeUrlInput />
        </Flex>
      </Box>
    </main>
  );
}
