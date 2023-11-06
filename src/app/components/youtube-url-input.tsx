"use client";
import React, { useState } from "react";
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Button,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { z } from "zod";
import { trpc } from "../_trpc/client";
import { currentVideoLatestCommentAtom, videoAtom } from "../store";
import { useAtom } from "jotai";

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
      toast({
        title: "Valid URL",
        description: "The URL you've entered looks good!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
      alignContent="end"
      maxWidth={600}
    >
      <FormLabel htmlFor="youtube-url">YouTube URL</FormLabel>
      <MotionInput
        id="youtube-url"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter the YouTube URL"
        isInvalid={!!error}
        whileFocus={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        mb={5}
      />

      {!error && inputValue && (
        <MotionButton
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={onSubmit}
        >
          Submit
        </MotionButton>
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
}
