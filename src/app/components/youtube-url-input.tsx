"use client";
import React, { useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Button,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { z } from "zod";
import { trpc } from "../_trpc/client";
import { currentVideoLatestCommentAtom, videoAtom } from "../store";
import { useAtom } from "jotai";
import { FaYoutube } from "react-icons/fa";
// Define the schema using Zod
const urlSchema = z.string().url();

const MotionInput = motion(Input);

const MotionButton = motion(Button);

export function YouTubeUrlInput() {
  const processVideoFromUrlMutation = trpc.processVideoFromUrl.useMutation();
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const [video, setVideo] = useAtom(videoAtom);
  const [latestComment, setLatestComment] = useAtom(
    currentVideoLatestCommentAtom
  );

  const validateInput = (value: string) => {
    try {
      urlSchema.parse(value);
      setError(null);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue) {
      validateInput(newValue);
    } else {
      setError(null);
    }
  };

  const onSubmit = async () => {
    // Prevent the default form submit action
    try {
      const { video, latestComment } =
        await processVideoFromUrlMutation.mutateAsync(inputValue);

      if (!video) return;

      setVideo({ ...video, updatedAt: new Date(video.updatedAt) });
      setLatestComment(latestComment);
    } catch (e) {
      if (e instanceof Error)
        toast({
          title: "Error",
          description: e.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    }
  };

  return (
    <FormControl
      isInvalid={!!error}
      display="flex"
      flexDirection="column"
      alignItems="center"
      maxWidth={600}
      width="100%"
      padding={4}
      boxShadow="lg" // Add shadow to the form control for depth
      borderRadius="md" // Round the corners for a softer look
      bg="gray.100" // Use a light background for the input area
    >
      <FormLabel htmlFor="youtube-url" display="flex" alignItems="center">
        <Icon as={FaYoutube} marginRight={2} color="red.500" />
        DoBli - Translate YouTube videos
      </FormLabel>
      <MotionInput
        id="youtube-url"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        isInvalid={!!error}
        whileFocus={{ scale: 1.02 }} // More subtle scale effect
        transition={{ duration: 0.2 }}
        mb={5}
      />

      {processVideoFromUrlMutation.isLoading ? (
        <Spinner />
      ) : (
        !error &&
        inputValue && (
          <MotionButton
            bgColor="crimson"
            color="white"
            whileHover={{ scale: 1.02 }} // More subtle hover effect
            whileTap={{ scale: 0.98 }} // Add effect on click
            leftIcon={
              processVideoFromUrlMutation.isLoading ? (
                <Spinner />
              ) : (
                <FaYoutube />
              )
            } // Add icon for visual cue
            onClick={onSubmit}
          >
            Submit
          </MotionButton>
        )
      )}

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
