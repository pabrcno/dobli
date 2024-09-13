import { Video, Comment } from "@prisma/client";
import { atom } from "jotai";

export const videoAtom = atom<Video | null>(null);
export const currentVideoLatestCommentAtom = atom<Comment | null>(null);
